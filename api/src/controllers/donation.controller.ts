
// src/controllers/donation.controller.ts
import { Request, Response } from 'express';
import * as donationService from '../services/donation.service';
import * as airtelService from '../services/airtel.service';
import { DonationStatus, DonationMethod } from '@prisma/client';
import { z } from 'zod';
import { EmailService } from '../services/email.service';
import { randomUUID } from 'crypto';

const donationSchema = z.object({
  amount: z.number().positive("Le montant doit être positif."),
  name: z.string().min(2, "Le nom est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  phone: z.string().min(1, "Le numéro de téléphone est requis pour le paiement."),
  type: z.enum(['Ponctuel', 'Mensuel']),
  method: z.nativeEnum(DonationMethod),
});

export const createDonation = async (req: Request, res: Response) => {
  try {
    const validatedData = donationSchema.parse(req.body);
    
    const externalTransactionId = randomUUID();

    // 1. Create a pending donation record in our DB
    const pendingDonation = await donationService.createDonation({
      ...validatedData,
      status: DonationStatus.PENDING,
      externalTransactionId,
    });
    
    // 2. If the method is Airtel Money, initiate the transaction
    if (validatedData.method === DonationMethod.AirtelMoney) {
        try {
            const airtelResponse = await airtelService.initiateUssdPushPayment({
                msisdn: validatedData.phone,
                amount: validatedData.amount,
                transactionId: externalTransactionId,
            });
            
             res.status(201).json({ 
                success: true,
                message: "Transaction initiée. Veuillez valider sur votre téléphone.",
                donationId: pendingDonation.id,
                airtelResponse: airtelResponse
            });

        } catch (airtelError: any) {
            // If Airtel payment initiation fails, mark our donation as FAILED
            await donationService.updateDonationStatus(pendingDonation.id, DonationStatus.FAILED);
            return res.status(400).json({ 
                success: false, 
                message: `L'initiation du paiement a échoué: ${airtelError.message}` 
            });
        }
    } else {
        // Fallback for other methods if ever re-enabled
        // For now, this branch is unlikely to be taken
        await EmailService.sendDonationInstructions(validatedData.email, validatedData.name, validatedData.amount);
         res.status(201).json({ 
            success: true,
            message: "Promesse de don enregistrée. Instructions envoyées par e-mail.",
            donationId: pendingDonation.id 
        });
    }


  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
    }
    console.error("Donation creation error:", error);
    res.status(500).json({ message: 'Error creating donation', error: (error as Error).message });
  }
};

export const confirmDonation = async (req: Request, res: Response) => {
  try {
    const { donationId } = req.body;
    if (!donationId) {
      return res.status(400).json({ message: 'Donation ID is required.' });
    }

    const updatedDonation = await donationService.updateDonationStatus(donationId, DonationStatus.CONFIRMED);
    
    // TODO: Trigger sending a receipt email here in a future step

    res.status(200).json({
      message: 'Donation confirmed successfully.',
      donation: updatedDonation
    });
  } catch (error) {
     res.status(500).json({ message: 'Error confirming donation', error: (error as Error).message });
  }
};


export const getDonations = async (req: Request, res: Response) => {
  try {
    const donations = await donationService.getAllDonations();
    res.json(donations);
  } catch (error)
 {
    res.status(500).json({ message: 'Error fetching donations', error });
  }
};

const summarySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  limit: z.coerce.number().int().positive().default(100),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const getDonationsSummary = async (req: Request, res: Response) => {
    try {
        const { from, to, limit, offset } = summarySchema.parse(req.query);

        // Convert dates to EPOCH format (seconds)
        const fromEpoch = Math.floor(from.getTime() / 1000);
        const toEpoch = Math.floor(to.getTime() / 1000);

        const summary = await airtelService.getTransactionsSummary({
            from: fromEpoch,
            to: toEpoch,
            limit,
            offset
        });
        
        res.status(200).json(summary);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error fetching donations summary', error: (error as Error).message });
    }
}


const airtelCallbackSchema = z.object({
    transaction: z.object({
        id: z.string(),
        message: z.string(),
        status_code: z.enum(['TS', 'TF']),
        airtel_money_id: z.string(),
    })
});

export const handleAirtelCallback = async (req: Request, res: Response) => {
    try {
        console.log("Airtel Callback Received:", JSON.stringify(req.body, null, 2));
        const { transaction } = airtelCallbackSchema.parse(req.body);

        const status = transaction.status_code === 'TS' ? DonationStatus.CONFIRMED : DonationStatus.FAILED;
        
        const updatedDonation = await donationService.updateDonationByExternalId(transaction.id, status, transaction.airtel_money_id);
        
        if (updatedDonation && status === 'CONFIRMED') {
            // Optional: Send a success email to the donor
            // await EmailService.sendDonationReceipt(updatedDonation.email, ...);
        }

        res.status(200).json({ success: true, message: "Callback processed." });
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid callback format', errors: error.flatten().fieldErrors });
        }
        console.error("Error processing Airtel callback:", error);
        // Inform Airtel that we had an issue but received the request
        res.status(500).json({ success: false, message: 'Error processing callback.' });
    }
}
