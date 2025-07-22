// src/routes/sponsorship.routes.ts
import { Router } from 'express';
import * as sponsorshipController from '../controllers/sponsorship.controller';

const router = Router();

router.post('/sponsorships', sponsorshipController.createSponsorship);
router.get('/sponsorships', sponsorshipController.getSponsorships);

export default router;
