// src/routes/appointment.routes.ts
import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Public route to create an appointment
router.post('/appointments', appointmentController.createAppointments);

// Protected routes for management
router.get('/appointments', protect, isAdmin, appointmentController.getAppointments);
router.patch('/appointments/:id/status', protect, isAdmin, appointmentController.updateAppointmentStatus);

export default router;
