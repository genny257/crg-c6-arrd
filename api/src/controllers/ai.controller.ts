// src/controllers/ai.controller.ts
import { Request, Response } from 'express';
import * as aiService from '@/services/ai.service';
import { z } from 'zod';

const ChatbotSchema = z.object({
  messages: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
  }))
});

export const runChatbotController = async (req: Request, res: Response) => {
  try {
    const { messages } = ChatbotSchema.parse(req.body);
    const response = await aiService.runChatbot(messages);
    res.status(200).json({ response });
  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Error running chatbot', error });
  }
};
