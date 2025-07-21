// src/routes/mission.routes.ts
import { Router } from 'express';
import * as missionController from '../controllers/mission.controller';

const router = Router();

router.get('/missions', missionController.getMissions);

export default router;
