// src/routes/annual-stat.routes.ts
import { Router } from 'express';
import * as annualStatController from '../controllers/annual-stat.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Public route to get visible stats for the homepage
router.get('/annual-stats/public', annualStatController.getPublicStats);

// Protected routes for management
router.use('/annual-stats', protect, isAdmin);

router.get('/annual-stats', annualStatController.getAllStats);
router.post('/annual-stats', annualStatController.createStat);
router.put('/annual-stats/:id', annualStatController.updateStat);
router.delete('/annual-stats/:id', annualStatController.deleteStat);

export default router;
