// src/controllers/volunteer.controller.ts
import { Request, Response } from 'express';
import * as volunteerService from '../services/volunteer.service';
import * as userService from '../services/user.service';
import { z } from 'zod';

const volunteerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  birthDate: z.string().refine((date) => !isNaN(new Date(date).getTime())),
  // Ajoutez ici d'autres champs du formulaire d'inscription si nécessaire
});


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
        // Validation avec Zod
        const volunteerData = volunteerSchema.parse(req.body);
        // Utilisation du service de création d'utilisateur existant qui gère le hashage, etc.
        const volunteer = await userService.createUser(volunteerData);
        res.status(201).json(volunteer);
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.issues });
        }
        res.status(500).json({ message: 'Error creating volunteer', error: (error as Error).message });
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
  status: z.enum(['ACTIVE', 'INACTIVE', 'REJECTED', 'PENDING']),
});

export const updateVolunteerStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = statusUpdateSchema.parse(req.body);

        const updatedVolunteer = await volunteerService.updateVolunteerStatus(id, status);

        res.json(updatedVolunteer);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.issues });
        }
        res.status(500).json({ message: 'Error updating volunteer status', error });
    }
};
