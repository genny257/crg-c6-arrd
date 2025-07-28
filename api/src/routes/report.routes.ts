// src/routes/report.routes.ts
import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Publicly accessible to get all visible reports
router.get('/reports', reportController.getReports);

// Protected routes for management
router.post('/reports', protect, isAdmin, reportController.createReport);
router.get('/reports/:id', protect, isAdmin, reportController.getReportById);
router.put('/reports/:id', protect, isAdmin, reportController.updateReport);
router.delete('/reports/:id', protect, isAdmin, reportController.deleteReport);

export default router;
