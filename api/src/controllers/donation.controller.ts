// src/controllers/donation.controller.ts
import { Request, Response } from 'express';
import * as donationService from '../services/donation.service';
import { DonationStatus, DonationMethod, DonationType } from '@prisma/client';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z.number().positive("Le montant doit être positif."),
  name: z.string().min(2, "Le nom est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  method: z.enum(['Mobile_Money']), // Removed 'Carte_Bancaire'
  type: z.enum(['Ponctuel', 'Mensuel']),
});

export const createDonation = async (req: Request, res: Response) => {
  try {
    const validatedData = donationSchema.parse(req.body);
    
    const donation = await donationService.createDonation({
      ...validatedData,
      status: DonationStatus.PENDING,
    });

    // Here you would typically trigger instructions for Mobile Money payment,
    // for example by sending an email or SMS. For now, we just confirm creation.

    res.status(201).json({ 
      message: "Donation promise recorded successfully.",
      donationId: donation.id 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
    }
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
