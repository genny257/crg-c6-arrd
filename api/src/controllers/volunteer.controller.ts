// src/controllers/volunteer.controller.ts
import { Request, Response } from 'express';
import * as volunteerService from '../services/volunteer.service';

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

export const updateVolunteer = async (req: Request, res: Response) => {
    try {
        const volunteer = await volunteerService.updateVolunteer(req.params.id, req.body);
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating volunteer', error });
    }
};

export const deleteVolunteer = async (req: Request, res: Response) => {
    try {
        await volunteerService.deleteVolunteer(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting volunteer', error });
    }
};
