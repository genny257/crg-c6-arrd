// src/controllers/ai.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import * as aiService from '../services/ai.service';
import { MessageSchema } from '../services/ai.service';


const chatSchema = z.object({
  messages: z.array(MessageSchema),
});

export const handleChat = async (req: Request, res: Response) => {
    try {
        const { messages } = chatSchema.parse(req.body);

        const response = await aiService.runChatbot(messages);

        res.status(200).json({ response });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        console.error("Error in chat handler:", error);
        res.status(500).json({ message: 'Error processing chat request', error: (error as Error).message });
    }
};
