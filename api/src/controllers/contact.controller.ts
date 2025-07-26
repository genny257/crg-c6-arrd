// src/controllers/contact.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import { EmailService } from '../services/email.service';

const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  subject: z.string().min(1, "Le sujet est requis."),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères."),
});

export const handleContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = contactSchema.parse(req.body);

        await EmailService.sendContactFormEmail(name, email, subject, message);

        res.status(200).json({ message: "Message sent successfully." });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        console.error("Error handling contact form:", error);
        res.status(500).json({ message: 'Error sending message', error: (error as Error).message });
    }
};
