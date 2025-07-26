// src/controllers/event.controller.ts
import { Request, Response } from 'express';
import * as eventService from '../services/event.service';
import { z } from 'zod';
import { EventStatus } from '@prisma/client';

const eventSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  location: z.string().min(1, "Le lieu est requis."),
  date: z.string().datetime("La date de l'événement est invalide.").transform((str) => new Date(str)),
  image: z.string().url("L'URL de l'image n'est pas valide.").optional().or(z.literal('')),
  imageHint: z.string().optional(),
  status: z.nativeEnum(EventStatus).default(EventStatus.UPCOMING),
});


export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

export const getFeaturedEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getFeaturedEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured events', error });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const validatedData = eventSchema.parse(req.body);
        const event = await eventService.createEvent(validatedData);
        res.status(201).json(event);
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error creating event', error });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const validatedData = eventSchema.partial().parse(req.body);
        const event = await eventService.updateEvent(req.params.id, validatedData);
        res.json(event);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error updating event', error });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        await eventService.deleteEvent(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};
