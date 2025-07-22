// src/controllers/event.controller.ts
import { Request, Response } from 'express';
import * as eventService from '../services/event.service';

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
        const event = await eventService.createEvent(req.body);
        res.status(201).json(event);
    } catch (error) {
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
        const event = await eventService.updateEvent(req.params.id, req.body);
        res.json(event);
    } catch (error) {
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
