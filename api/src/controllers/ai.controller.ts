// src/routes/ai.routes.ts - This file should be named ai.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import * as aiService from '../services/ai.service';
import { run } from 'genkit';

// Chatbot route (public)
const chatSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
    })),
});

export const chat = async (req: Request, res: Response) => {
    try {
        const { messages } = chatSchema.parse(req.body);
        const response = await run(aiService.chatbotFlow, messages);
        res.status(200).json({ response });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error processing chat request', error });
    }
};
