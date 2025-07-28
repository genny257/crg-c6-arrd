// src/controllers/action.controller.ts
import { Request, Response } from 'express';
import * as actionService from '../services/action.service';
import { z } from 'zod';

const actionSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  image: z.string().url("L'URL de l'image est invalide."),
  imageHint: z.string().optional().nullable(),
  dialogTitle: z.string().min(1, "Le titre du dialogue est requis."),
  dialogDescription: z.string().min(1, "La description du dialogue est requise."),
  dialogList: z.array(z.string()).min(1, "La liste ne peut pas être vide."),
  order: z.number().int().optional(),
});

export const getActions = async (req: Request, res: Response) => {
    try {
        const actions = await actionService.getAllActions();
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des actions.", error });
    }
};

export const createAction = async (req: Request, res: Response) => {
    try {
        const validatedData = actionSchema.parse(req.body);
        const action = await actionService.createAction(validatedData);
        res.status(201).json(action);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: "Erreur lors de la création de l'action.", error });
    }
};

export const updateAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = actionSchema.partial().parse(req.body);
        const action = await actionService.updateAction(id, validatedData);
        res.status(200).json(action);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'action.", error });
    }
};

export const deleteAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await actionService.deleteAction(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'action.", error });
    }
};
