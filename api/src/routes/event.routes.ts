// src/routes/event.routes.ts
import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Public routes
router.get('/events/featured', eventController.getFeaturedEvents);
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);

// Protected routes for management
router.post('/events', protect, isAdmin, eventController.createEvent);
router.put('/events/:id', protect, isAdmin, eventController.updateEvent);
router.delete('/events/:id', protect, isAdmin, eventController.deleteEvent);

export default router;
