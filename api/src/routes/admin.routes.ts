// src/routes/admin.routes.ts
import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { protect, isSuperAdmin } from '../middleware/auth';

const router = Router();

// Protect all routes in this file and ensure user is a SUPERADMIN
router.use(protect, isSuperAdmin);

router.get('/stats', adminController.getStats);
router.get('/traffic', adminController.getTraffic);
router.get('/threats', adminController.getThreats);

router.get('/blocked-ips', adminController.getBlockedIPs);
router.post('/blocked-ips', adminController.blockIP);
router.delete('/blocked-ips/:id', adminController.unblockIP);

export default router;
