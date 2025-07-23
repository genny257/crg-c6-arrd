// src/routes/event.routes.ts
import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/events/featured', eventController.getFeaturedEvents);
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);

// Protected routes for management
router.post('/events', protect, eventController.createEvent);
router.put('/events/:id', protect, eventController.updateEvent);
router.delete('/events/:id', protect, eventController.deleteEvent);

export default router;
