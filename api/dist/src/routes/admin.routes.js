"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin.routes.ts
const express_1 = require("express");
const adminController = __importStar(require("../controllers/admin.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administration and analytics endpoints (SuperAdmin access required)
 */
// Protect all routes in this file and ensure user is a SUPERADMIN
router.use(auth_1.protect, auth_1.isSuperAdmin);
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
router.get('/stats', adminController.getStats);
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
router.get('/analytics', adminController.getAnalytics);
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
exports.default = router;
