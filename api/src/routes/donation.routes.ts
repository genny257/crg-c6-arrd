// src/routes/donation.routes.ts
import { Router } from 'express';
import { createDonation, getDonations } from '../controllers/donation.controller';

const router = Router();

router.post('/donations', createDonation);
router.get('/donations', getDonations);

export default router;
