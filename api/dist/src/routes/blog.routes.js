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
// src/routes/blog.routes.ts
const express_1 = require("express");
const blogController = __importStar(require("../controllers/blog.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
router.post('/blog/generate', auth_1.protect, blogController.generateBlogPost);
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
    .post(auth_1.protect, blogController.createBlogPost);
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
    .put(auth_1.protect, blogController.updateBlogPost)
    .delete(auth_1.protect, blogController.deleteBlogPost);
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
exports.default = router;
