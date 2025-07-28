// src/controllers/donation.controller.ts
import { Request, Response } from 'express';
import * as donationService from '../services/donation.service';
import * as airtelService from '../services/airtel.service';
import { DonationStatus, DonationMethod, DonationType } from '@prisma/client';
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
            // This pin should be collected securely and encrypted on the client side.
            // Using a placeholder for now.
            const placeholderPin = "1234";

            const airtelResponse = await airtelService.initiateCashIn({
                msisdn: validatedData.phone,
                amount: validatedData.amount,
                transactionId: externalTransactionId,
                pin: placeholderPin, // This needs proper encryption
            });
            
            // Update our donation record with Airtel's transaction ID
            await donationService.updateDonationWithAirtelId(
                pendingDonation.id, 
                airtelResponse.data.transaction.airtel_money_id
            );

             res.status(201).json({ 
                success: true,
                message: "Transaction initiated successfully. Please approve on your phone.",
                donationId: pendingDonation.id,
                airtelTransactionId: airtelResponse.data.transaction.airtel_money_id
            });

        } catch (airtelError: any) {
            // If Airtel payment fails, mark our donation as FAILED
            await donationService.updateDonationStatus(pendingDonation.id, DonationStatus.FAILED);
            return res.status(400).json({ 
                success: false, 
                message: `Payment initiation failed: ${airtelError.message}` 
            });
        }
    } else {
        // Handle other payment methods like Mobile Money (manual instructions)
        await EmailService.sendDonationInstructions(validatedData.email, validatedData.name, validatedData.amount);
         res.status(201).json({ 
            success: true,
            message: "Donation promise recorded. Instructions sent via email.",
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
