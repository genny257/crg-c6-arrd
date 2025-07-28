// src/controllers/appointment.controller.ts
import { Request, Response } from 'express';
import * as appointmentService from '../services/appointment.service';
import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';
import { EmailService } from '../services/email.service';

const appointmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  phone: z.string().optional(),
  reason: z.enum(['VOLUNTEERING_INFO', 'TRAINING_INFO', 'PARTNERSHIP', 'OTHER']),
  details: z.string().optional(),
  scheduledAt: z.string().datetime("La date du rendez-vous est invalide."),
});

export const createAppointments = async (req: Request, res: Response) => {
    try {
        const validatedData = appointmentSchema.parse(req.body);
        const appointment = await appointmentService.createAppointment({
            ...validatedData,
            scheduledAt: new Date(validatedData.scheduledAt),
        });

        // Send notification email to admin
        await EmailService.sendNewAppointmentNotification(appointment);
        
        res.status(201).json(appointment);
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error creating appointment', error });
    }
};

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

const statusSchema = z.object({
    status: z.nativeEnum(AppointmentStatus)
});

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = statusSchema.parse(req.body);
        const appointment = await appointmentService.updateAppointmentStatus(id, status);
        res.status(200).json(appointment);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error updating appointment status', error });
    }
}
