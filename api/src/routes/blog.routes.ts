// src/routes/blog.routes.ts
import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/blog/featured', blogController.getFeaturedBlogPosts);
router.post('/blog/generate', protect, blogController.generateBlogPost);

router.route('/blog')
    .get(blogController.getBlogPosts)
    .post(protect, blogController.createBlogPost);

router.route('/blog/:id')
    .get(blogController.getBlogPostById)
    .put(protect, blogController.updateBlogPost)
    .delete(protect, blogController.deleteBlogPost);

router.route('/blog/slug/:slug')
    .get(blogController.getBlogPostBySlug);

export default router;
