// src/routes/partner.routes.ts
import { Router } from 'express';
import * as partnerController from '../controllers/partner.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Public route to get all partners
router.get('/partners', partnerController.getPartners);

// Protected routes for management
router.post('/partners', protect, isAdmin, partnerController.createPartner);
router.put('/partners/:id', protect, isAdmin, partnerController.updatePartner);
router.delete('/partners/:id', protect, isAdmin, partnerController.deletePartner);

export default router;
