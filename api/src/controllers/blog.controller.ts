// src/controllers/blog.controller.ts
import { Request, Response } from 'express';
import * as blogService from '../services/blog.service';

export const getBlogPosts = async (req: Request, res: Response) => {
    try {
        const posts = await blogService.getAllBlogPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts', error });
    }
};

export const getFeaturedBlogPosts = async (req: Request, res: Response) => {
    try {
        const posts = await blogService.getFeaturedBlogPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured blog posts', error });
    }
};

export const createBlogPost = async (req: Request, res: Response) => {
    try {
        const post = await blogService.createBlogPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog post', error });
    }
};

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

export const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const post = await blogService.updateBlogPost(req.params.id, req.body);
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog post', error });
    }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        await blogService.deleteBlogPost(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog post', error });
    }
};
