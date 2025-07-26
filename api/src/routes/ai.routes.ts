// src/routes/ai.routes.ts
import { Router } from 'express';
import { runChatbotController } from '@/controllers/ai.controller';
import { protect } from '@/middleware/auth';

const router = Router();

// This route might not be necessary if the chatbot is only used internally or via websockets
// but it's here for completeness as a standard REST endpoint.
router.post('/ai/chat', protect, runChatbotController);

export default router;
