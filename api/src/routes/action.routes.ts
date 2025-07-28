// src/routes/action.routes.ts
import { Router } from 'express';
import * as actionController from '../controllers/action.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Public route to get all actions
router.get('/actions', actionController.getActions);

// Protected routes
router.use('/actions', protect, isAdmin);

router.post('/actions', actionController.createAction);
router.put('/actions/:id', actionController.updateAction);
router.delete('/actions/:id', actionController.deleteAction);

export default router;
