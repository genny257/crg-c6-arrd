// src/controllers/sponsorship.controller.ts
import { Request, Response } from 'express';
import * as sponsorshipService from '../services/sponsorship.service';
import { z } from 'zod';
import { EmailService } from '../services/email.service';
import { SponsorshipStatus } from '@prisma/client';

const sponsorshipSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  contactName: z.string().min(1, "Le nom du contact est requis"),
  email: z.string().email("L'adresse e-mail est invalide"),
  phone: z.string().optional(),
  message: z.string().min(1, "Le message ne peut pas être vide"),
});

export const createSponsorship = async (req: Request, res: Response) => {
    try {
        const data = sponsorshipSchema.parse(req.body);
        const sponsorship = await sponsorshipService.createSponsorship({
            ...data,
            phone: data.phone || null,
        });
        
        // Send confirmation email
        await EmailService.sendSponsorshipConfirmation(data.email, data.companyName);

        res.status(201).json(sponsorship);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation invalide', errors: error.flatten().fieldErrors });
        }
        console.error("Error creating sponsorship:", error);
        res.status(500).json({ message: 'Erreur lors de la création de la demande de mécénat', error });
    }
};

export const getSponsorships = async (req: Request, res: Response) => {
    try {
        const sponsorships = await sponsorshipService.getAllSponsorships();
        res.status(200).json(sponsorships);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes de mécénat', error });
    }
};

const statusUpdateSchema = z.object({
  status: z.nativeEnum(SponsorshipStatus),
});

export const updateSponsorshipStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = statusUpdateSchema.parse(req.body);

        const updatedSponsorship = await sponsorshipService.updateSponsorshipStatus(id, status);

        res.status(200).json(updatedSponsorship);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation invalide', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error });
    }
};
