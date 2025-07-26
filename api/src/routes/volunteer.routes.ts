
// src/routes/volunteer.routes.ts
import { Router } from 'express';
import * as volunteerController from '../controllers/volunteer.controller';
import { protect } from '../middleware/auth'; 

const router = Router();

// Public route for creation
router.post('/volunteers', volunteerController.createVolunteer);

// Protected routes for management
router.get('/volunteers', protect, volunteerController.getVolunteers);
router.get('/volunteers/:id', protect, volunteerController.getVolunteerById);
router.patch('/volunteers/:id/status', protect, volunteerController.updateVolunteerStatus);

export default router;
