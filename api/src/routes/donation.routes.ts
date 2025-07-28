// src/routes/donation.routes.ts
import { Router } from 'express';
import { createDonation, getDonations, confirmDonation, getDonationsSummary, handleAirtelCallback } from '../controllers/donation.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

router.post('/donations', createDonation);
router.post('/donations/confirm', protect, isAdmin, confirmDonation);

// Webhook for Airtel to notify us of transaction status
router.post('/donations/callback', handleAirtelCallback);

router.get('/donations', protect, isAdmin, getDonations);
router.get('/donations/summary', protect, isAdmin, getDonationsSummary);


export default router;
