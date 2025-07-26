// src/routes/admin.routes.ts
import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { protect, isSuperAdmin } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Custom middleware to check for Admin or SuperAdmin roles
const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administration and analytics endpoints (SuperAdmin access required)
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get general site statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A summary of site statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRequests:
 *                   type: integer
 *                 totalThreats:
 *                   type: integer
 *                 totalBlocked:
 *                   type: integer
 *                 uniqueVisitors:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/stats', protect, isAdmin, adminController.getStats);

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get detailed analytics for the dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detailed analytics data including key metrics and chart histories.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/analytics', protect, isAdmin, adminController.getAnalytics);

// Protect all following routes in this file and ensure user is a SUPERADMIN
router.use(protect, isSuperAdmin);

/**
 * @swagger
 * /admin/traffic:
 *   get:
 *     summary: Get paginated traffic logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: A paginated list of traffic logs.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/traffic', adminController.getTraffic);

/**
 * @swagger
 * /admin/threats:
 *   get:
 *     summary: Get paginated security threat logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: A paginated list of security threats.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/threats', adminController.getThreats);

/**
 * @swagger
 * /admin/blocked-ips:
 *   get:
 *     summary: Get all blocked IP addresses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of blocked IP addresses.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/blocked-ips', adminController.getBlockedIPs);

/**
 * @swagger
 * /admin/blocked-ips:
 *   post:
 *     summary: Block a new IP address
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ip
 *             properties:
 *               ip:
 *                 type: string
 *                 format: ipv4
 *                 description: The IP address to block.
 *               reason:
 *                 type: string
 *                 description: An optional reason for blocking the IP.
 *     responses:
 *       201:
 *         description: IP address blocked successfully.
 *       400:
 *         description: Invalid input or IP already blocked.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/blocked-ips', adminController.blockIP);

/**
 * @swagger
 * /admin/blocked-ips/{id}:
 *   delete:
 *     summary: Unblock an IP address
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blocked IP record.
 *     responses:
 *       204:
 *         description: IP address unblocked successfully.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Error unblocking IP.
 */
router.delete('/blocked-ips/:id', adminController.unblockIP);

export default router;
