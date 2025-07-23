// src/routes/team.routes.ts
import { Router } from 'express';
import { getTeamStructure } from '../controllers/team.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/team/structure', protect, getTeamStructure);

export default router;
