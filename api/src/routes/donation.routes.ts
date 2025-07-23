// src/routes/donation.routes.ts
import { Router } from 'express';
import { createDonation, getDonations, confirmDonation } from '../controllers/donation.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/donations', createDonation);
router.post('/donations/confirm', confirmDonation);

router.get('/donations', protect, getDonations);

export default router;
