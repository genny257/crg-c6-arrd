// src/routes/report.routes.ts
import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Publicly accessible to get all visible reports
router.get('/reports', reportController.getReports);

// Protected routes for management
router.post('/reports', protect, reportController.createReport);
router.get('/reports/:id', protect, reportController.getReportById);
router.put('/reports/:id', protect, reportController.updateReport);
router.delete('/reports/:id', protect, reportController.deleteReport);

export default router;
