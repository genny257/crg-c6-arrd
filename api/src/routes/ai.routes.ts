// src/routes/ai.routes.ts
import { Router } from 'express';
import { handleChat } from '../controllers/ai.controller';
import { suggestVolunteersForMission } from '../controllers/mission.controller';
import { generateBlogPost } from '../controllers/blog.controller';
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


/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Endpoints for AI-powered features
 */

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Interact with the chatbot
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ChatMessage'
 *     responses:
 *       200:
 *         description: The chatbot's response.
 *       400:
 *         description: Invalid input.
 */
router.post('/ai/chat', handleChat);


/**
 * @swagger
 * /ai/missions/{id}/suggest-volunteers:
 *   post:
 *     summary: Suggest volunteers for a mission using AI
 *     tags: [AI]
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
 *         description: A list of suggested volunteers.
 *       500:
 *         description: Server error
 */
router.post('/missions/:id/suggest-volunteers', protect, isAdmin, suggestVolunteersForMission);

/**
 * @swagger
 * /ai/blog/generate:
 *   post:
 *     summary: Generate a blog post from a topic using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The topic for the AI to write about.
 *     responses:
 *       200:
 *         description: The generated blog post content.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Server error
 */
router.post('/blog/generate', protect, isAdmin, generateBlogPost);


export default router;
