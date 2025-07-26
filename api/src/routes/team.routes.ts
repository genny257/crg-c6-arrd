// src/routes/team.routes.ts
import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Custom middleware to check for Admin or SuperAdmin roles
const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Publicly accessible route to view team structure
router.get('/team/structure', teamController.getTeamStructure);

// Protected routes for management
router.use(protect, isAdmin);

// Role management
router.get('/team/roles', teamController.getTeamRoles);
router.post('/team/roles', teamController.createTeamRole);
router.put('/team/roles/:id', teamController.updateTeamRole);
router.delete('/team/roles/:id', teamController.deleteTeamRole);

// Pool management
router.get('/team/pools', teamController.getTeamPools);
router.post('/team/pools', teamController.createTeamPool);
router.put('/team/pools/:id', teamController.updateTeamPool);
router.delete('/team/pools/:id', teamController.deleteTeamPool);

// Assignment management
router.post('/team/assign-role', teamController.assignRoleToUser);
router.post('/team/assign-coordinator', teamController.assignCoordinator);
router.post('/team/remove-coordinator', teamController.removeCoordinator);

export default router;
