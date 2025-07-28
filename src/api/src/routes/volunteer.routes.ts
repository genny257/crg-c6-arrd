// src/routes/volunteer.routes.ts
import { Router } from 'express';
import * as volunteerController from '../controllers/volunteer.controller';
import { protect } from '../middleware/auth'; 
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Public route for creation
router.post('/volunteers', volunteerController.createVolunteer);

// Public route to get featured volunteers for the homepage
router.get('/volunteers/featured', volunteerController.getFeaturedVolunteers);

// Protected routes for management
router.get('/volunteers', protect, isAdmin, volunteerController.getVolunteers);
router.get('/volunteers/:id', protect, isAdmin, volunteerController.getVolunteerById);
router.patch('/volunteers/:id/status', protect, isAdmin, volunteerController.updateVolunteerStatus);
router.patch('/volunteers/:id/feature', protect, isAdmin, volunteerController.updateVolunteerFeatureStatus);


export default router;
