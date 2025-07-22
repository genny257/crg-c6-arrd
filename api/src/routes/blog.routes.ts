// src/routes/blog.routes.ts
import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';

const router = Router();

router.route('/blog')
    .get(blogController.getBlogPosts)
    .post(blogController.createBlogPost);

router.route('/blog/:id')
    .get(blogController.getBlogPostById)
    .put(blogController.updateBlogPost)
    .delete(blogController.deleteBlogPost);

router.route('/blog/slug/:slug')
    .get(blogController.getBlogPostBySlug);

export default router;
