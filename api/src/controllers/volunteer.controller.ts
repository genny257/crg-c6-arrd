// src/controllers/volunteer.controller.ts
import { Request, Response } from 'express';
import * as volunteerService from '../services/volunteer.service';
import { z } from 'zod';

export const getVolunteers = async (req: Request, res: Response) => {
    try {
        const volunteers = await volunteerService.getAllVolunteers();
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching volunteers', error });
    }
};

export const createVolunteer = async (req: Request, res: Response) => {
    try {
        // TODO: Validate req.body with a Zod schema
        const volunteer = await volunteerService.createVolunteer(req.body);
        res.status(201).json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating volunteer', error });
    }
};

export const getVolunteerById = async (req: Request, res: Response) => {
    try {
        const volunteer = await volunteerService.getVolunteerById(req.params.id);
        if (volunteer) {
            res.json(volunteer);
        } else {
            res.status(404).json({ message: 'Volunteer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching volunteer', error });
    }
};

const statusUpdateSchema = z.object({
  status: z.enum(['Actif', 'Inactif', 'Rejeté', 'En_attente']),
});

export const updateVolunteerStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = statusUpdateSchema.parse(req.body);

        const updatedVolunteer = await volunteerService.updateVolunteerStatus(id, status);

        res.json(updatedVolunteer);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Error updating volunteer status', error });
    }
};
