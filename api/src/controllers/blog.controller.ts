// src/controllers/blog.controller.ts
import { Request, Response } from 'express';
import * as blogService from '../services/blog.service';
import * as aiService from '../services/ai.service';
import { z } from 'zod';

/**
 * Retrieves all blog posts.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response containing a list of all blog posts.
 */
export const getBlogPosts = async (req: Request, res: Response) => {
    try {
        const posts = await blogService.getAllBlogPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts', error });
    }
};

/**
 * Retrieves featured blog posts.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response containing a list of featured blog posts.
 */
export const getFeaturedBlogPosts = async (req: Request, res: Response) => {
    try {
        const posts = await blogService.getFeaturedBlogPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured blog posts', error });
    }
};

/**
 * Creates a new blog post.
 * @param {Request} req - The Express request object, containing post data in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the newly created blog post.
 */
export const createBlogPost = async (req: Request, res: Response) => {
    try {
        const post = await blogService.createBlogPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog post', error });
    }
};

/**
 * Retrieves a single blog post by its ID.
 * @param {Request} req - The Express request object, containing the post ID in params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the blog post or a 404 error if not found.
 */
export const getBlogPostById = async (req: Request, res: Response) => {
    try {
        const post = await blogService.getBlogPostById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post', error });
    }
};

/**
 * Retrieves a single blog post by its slug.
 * @param {Request} req - The Express request object, containing the post slug in params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the blog post or a 404 error if not found.
 */
export const getBlogPostBySlug = async (req: Request, res: Response) => {
    try {
        const post = await blogService.getBlogPostBySlug(req.params.slug);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post', error });
    }
};

/**
 * Updates an existing blog post.
 * @param {Request} req - The Express request object, containing the ID in params and update data in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the updated blog post.
 */
export const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const post = await blogService.updateBlogPost(req.params.id, req.body);
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog post', error });
    }
};

/**
 * Deletes a blog post by its ID.
 * @param {Request} req - The Express request object, containing the post ID in params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A 204 No Content response on success.
 */
export const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        await blogService.deleteBlogPost(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog post', error });
    }
};

// Schema for validating the topic for AI generation
const generatePostSchema = z.object({
    topic: z.string().min(1, 'Le sujet est requis.'),
});

/**
 * Generates a new blog post using an AI flow based on a given topic.
 * @param {Request} req - The Express request object, containing the topic in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the AI-generated blog post content.
 */
export const generateBlogPost = async (req: Request, res: Response) => {
    try {
        const { topic } = generatePostSchema.parse(req.body);
        const blogPost = await aiService.generateBlogPost(topic);
        res.status(200).json(blogPost);
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error generating blog post', error });
    }
};