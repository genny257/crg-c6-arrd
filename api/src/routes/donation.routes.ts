// src/routes/donation.routes.ts
import { Router } from 'express';
import { createDonation, getDonations, confirmDonation } from '../controllers/donation.controller';

const router = Router();

router.post('/donations', createDonation);
router.post('/donations/confirm', confirmDonation);
router.get('/donations', getDonations);

export default router;
