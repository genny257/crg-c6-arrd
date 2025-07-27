// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { z } from 'zod';

const updateServiceSchema = z.object({
  isActive: z.boolean().optional(),
  apiKeys: z.record(z.any()).optional(),
});

export const getPaymentServices = async (req: Request, res: Response) => {
  try {
    const services = await paymentService.getAllPaymentServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment services', error });
  }
};

export const updatePaymentService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateServiceSchema.parse(req.body);

    const isDefaultService = await paymentService.isDefaultService(id);
    if (isDefaultService && validatedData.isActive === false) {
      return res.status(400).json({ message: "Le service par défaut ne peut pas être désactivé." });
    }

    const service = await paymentService.updatePaymentService(id, validatedData);
    res.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Error updating payment service', error });
  }
};

export const setDefaultService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await paymentService.setDefaultService(id);
    res.status(200).json({ message: 'Service par défaut mis à jour avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting default payment service', error: (error as Error).message });
  }
};

export const getActivePaymentServices = async (req: Request, res: Response) => {
  try {
    const services = await paymentService.getActivePaymentServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active payment services', error });
  }
};