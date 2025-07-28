// src/controllers/annual-stat.controller.ts
import { Request, Response } from 'express';
import * as annualStatService from '../services/annual-stat.service';
import { z } from 'zod';

const statSchema = z.object({
    year: z.number().int().min(2000),
    bases: z.number().int().nonnegative(),
    agents: z.number().int().nonnegative(),
    firstAidGraduates: z.number().int().nonnegative(),
    assistedHouseholds: z.number().int().nonnegative(),
    sensitizedPeople: z.number().int().nonnegative(),
    condomsDistributed: z.number().int().nonnegative(),
    isVisible: z.boolean().optional(),
});

export const getPublicStats = async (req: Request, res: Response) => {
    try {
        const stats = await annualStatService.getPublicStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public stats', error });
    }
};

export const getAllStats = async (req: Request, res: Response) => {
    try {
        const stats = await annualStatService.getAllStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const createStat = async (req: Request, res: Response) => {
    try {
        const validatedData = statSchema.parse(req.body);
        const stat = await annualStatService.createStat(validatedData);
        res.status(201).json(stat);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error creating stat', error });
    }
};

export const updateStat = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = statSchema.partial().parse(req.body);
        const stat = await annualStatService.updateStat(id, validatedData);
        res.status(200).json(stat);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error updating stat', error });
    }
};

export const deleteStat = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await annualStatService.deleteStat(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting stat', error });
    }
};
