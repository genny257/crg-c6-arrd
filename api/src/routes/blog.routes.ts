// src/routes/blog.routes.ts
import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
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
 *   name: Blog
 *   description: Blog post management
 */

/**
 * @swagger
 * /blog/featured:
 *   get:
 *     summary: Get featured blog posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: A list of featured blog posts.
 *       500:
 *         description: Server error
 */
router.get('/blog/featured', blogController.getFeaturedBlogPosts);

/**
 * @swagger
 * /blog/generate:
 *   post:
 *     summary: Generate a blog post from a topic using AI
 *     tags: [Blog]
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
router.post('/blog/generate', protect, isAdmin, blogController.generateBlogPost);

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: A list of all blog posts.
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Blog post created successfully.
 *       500:
 *         description: Server error
 */
router.route('/blog')
    .get(blogController.getBlogPosts)
    .post(protect, isAdmin, blogController.createBlogPost);

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested blog post.
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a blog post by ID
 *     tags: [Blog]
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
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated blog post.
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Blog post deleted successfully.
 *       500:
 *         description: Server error
 */
router.route('/blog/:id')
    .get(blogController.getBlogPostById)
    .put(protect, isAdmin, blogController.updateBlogPost)
    .delete(protect, isAdmin, blogController.deleteBlogPost);

/**
 * @swagger
 * /blog/slug/{slug}:
 *   get:
 *     summary: Get a blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested blog post.
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Server error
 */
router.route('/blog/slug/:slug')
    .get(blogController.getBlogPostBySlug);

export default router;
