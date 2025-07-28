// src/routes/payment.routes.ts
import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { protect, isSuperAdmin } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PaymentServices
 *   description: Management of payment services (Airtel, Stripe, etc.)
 */

/**
 * @swagger
 * /payment-services/active:
 *   get:
 *     summary: Get all active payment services for public use
 *     tags: [PaymentServices]
 *     responses:
 *       200:
 *         description: A list of active payment services.
 */
router.get('/payment-services/active', paymentController.getActivePaymentServices);


// All subsequent routes in this file are protected and require SuperAdmin role
router.use(protect, isSuperAdmin);

/**
 * @swagger
 * /payment-services:
 *   get:
 *     summary: Get all payment services for admin management
 *     tags: [PaymentServices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all payment services.
 *       403:
 *         description: Forbidden
 */
router.get('/payment-services', paymentController.getPaymentServices);

/**
 * @swagger
 * /payment-services/{id}:
 *   put:
 *     summary: Update a payment service (e.g., toggle active status, update API keys)
 *     tags: [PaymentServices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *               apiKeys:
 *                 type: object
 *     responses:
 *       200:
 *         description: The updated payment service.
 *       400:
 *         description: Invalid input.
 *       403:
 *         description: Forbidden
 */
router.put('/payment-services/:id', paymentController.updatePaymentService);

/**
 * @swagger
 * /payment-services/{id}/set-default:
 *   post:
 *     summary: Set a payment service as the default
 *     tags: [PaymentServices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message.
 *       403:
 *         description: Forbidden
 */
router.post('/payment-services/:id/set-default', paymentController.setDefaultService);


export default router;
