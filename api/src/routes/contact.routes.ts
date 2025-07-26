// src/routes/contact.routes.ts
import { Router } from 'express';
import { handleContactForm } from '../controllers/contact.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form submission
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit the contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/contact', handleContactForm);

export default router;
