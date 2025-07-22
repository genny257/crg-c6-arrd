// src/controllers/donation.controller.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import * as donationService from '../services/donation.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export const createDonation = async (req: Request, res: Response) => {
  try {
    const { amount, name, email, method, type } = req.body;

    // 1. Save the donation to your database with status 'En_attente'
    const donation = await donationService.createDonation({
      ...req.body,
      status: 'En_attente',
    });

    // 2. Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'eur', // Change to your currency
      metadata: { 
        name, 
        email,
        donationId: donation.id // Pass your internal donation ID to Stripe
      },
    });


    // 3. Return the client secret to the frontend
    res.status(201).json({ 
      clientSecret: paymentIntent.client_secret,
      donationId: donation.id 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error: (error as Error).message });
  }
};

export const confirmDonation = async (req: Request, res: Response) => {
  try {
    const { donationId } = req.body;
    if (!donationId) {
      return res.status(400).json({ message: 'Donation ID is required.' });
    }

    const updatedDonation = await donationService.updateDonationStatus(donationId, 'Confirmé');
    
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error });
  }
};
