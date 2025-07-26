// src/routes/sponsorship.routes.ts
import { Router } from 'express';
import * as sponsorshipController from '../controllers/sponsorship.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public route for creating a request
router.post('/sponsorships', sponsorshipController.createSponsorship);

// Protected route for viewing requests
router.get('/sponsorships', protect, sponsorshipController.getSponsorships);

// Protected route for updating status
router.patch('/sponsorships/:id/status', protect, sponsorshipController.updateSponsorshipStatus);


export default router;
