
// src/routes/ai.routes.ts
import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Chatbot route (public)
router.post('/chat', aiController.chat);


export default router;
