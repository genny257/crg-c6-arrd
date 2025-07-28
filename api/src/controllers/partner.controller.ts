// src/controllers/partner.controller.ts
import { Request, Response } from 'express';
import * as partnerService from '../services/partner.service';
import { z } from 'zod';

const partnerSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  logoUrl: z.string().url("L'URL du logo est invalide."),
  websiteUrl: z.string().url("L'URL du site web est invalide.").optional().nullable(),
  order: z.number().int().optional(),
});

export const getPartners = async (req: Request, res: Response) => {
    try {
        const partners = await partnerService.getAllPartners();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des partenaires.", error });
    }
};

export const createPartner = async (req: Request, res: Response) => {
    try {
        const validatedData = partnerSchema.parse(req.body);
        const partner = await partnerService.createPartner(validatedData);
        res.status(201).json(partner);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: "Erreur lors de la création du partenaire.", error });
    }
};

export const updatePartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = partnerSchema.partial().parse(req.body);
        const partner = await partnerService.updatePartner(id, validatedData);
        res.status(200).json(partner);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: "Erreur lors de la mise à jour du partenaire.", error });
    }
};

export const deletePartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await partnerService.deletePartner(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du partenaire.", error });
    }
};
