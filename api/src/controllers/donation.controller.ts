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

    // 1. Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'eur', // Change to your currency
      metadata: { name, email },
    });

    // 2. Save the donation to your database with status 'En_attente'
    const donation = await donationService.createDonation({
      ...req.body,
      status: 'En_attente',
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

export const getDonations = async (req: Request, res: Response) => {
  try {
    const donations = await donationService.getAllDonations();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error });
  }
};
