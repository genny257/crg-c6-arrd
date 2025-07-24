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
exports.generateBlogPost = exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostBySlug = exports.getBlogPostById = exports.createBlogPost = exports.getFeaturedBlogPosts = exports.getBlogPosts = void 0;
const blogService = __importStar(require("../services/blog.service"));
const aiService = __importStar(require("../services/ai.service"));
const zod_1 = require("zod");
const flow_1 = require("@genkit-ai/flow");
/**
 * Retrieves all blog posts.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response containing a list of all blog posts.
 */
const getBlogPosts = async (req, res) => {
    try {
        const posts = await blogService.getAllBlogPosts();
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts', error });
    }
};
exports.getBlogPosts = getBlogPosts;
/**
 * Retrieves featured blog posts.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response containing a list of featured blog posts.
 */
const getFeaturedBlogPosts = async (req, res) => {
    try {
        const posts = await blogService.getFeaturedBlogPosts();
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching featured blog posts', error });
    }
};
exports.getFeaturedBlogPosts = getFeaturedBlogPosts;
/**
 * Creates a new blog post.
 * @param {Request} req - The Express request object, containing post data in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the newly created blog post.
 */
const createBlogPost = async (req, res) => {
    try {
        const post = await blogService.createBlogPost(req.body);
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating blog post', error });
    }
};
exports.createBlogPost = createBlogPost;
/**
 * Retrieves a single blog post by its ID.
 * @param {Request} req - The Express request object, containing the post ID in params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the blog post or a 404 error if not found.
 */
const getBlogPostById = async (req, res) => {
    try {
        const post = await blogService.getBlogPostById(req.params.id);
        if (post) {
            res.json(post);
        }
        else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching blog post', error });
    }
};
exports.getBlogPostById = getBlogPostById;
/**
 * Retrieves a single blog post by its slug.
 * @param {Request} req - The Express request object, containing the post slug in params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the blog post or a 404 error if not found.
 */
const getBlogPostBySlug = async (req, res) => {
    try {
        const post = await blogService.getBlogPostBySlug(req.params.slug);
        if (post) {
            res.json(post);
        }
        else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching blog post', error });
    }
};
exports.getBlogPostBySlug = getBlogPostBySlug;
/**
 * Updates an existing blog post.
 * @param {Request} req - The Express request object, containing the ID in params and update data in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the updated blog post.
 */
const updateBlogPost = async (req, res) => {
    try {
        const post = await blogService.updateBlogPost(req.params.id, req.body);
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating blog post', error });
    }
};
exports.updateBlogPost = updateBlogPost;
/**
 * Deletes a blog post by its ID.
 * @param {Request} req - The Express request object, containing the post ID in params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A 204 No Content response on success.
 */
const deleteBlogPost = async (req, res) => {
    try {
        await blogService.deleteBlogPost(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting blog post', error });
    }
};
exports.deleteBlogPost = deleteBlogPost;
// Schema for validating the topic for AI generation
const generatePostSchema = zod_1.z.object({
    topic: zod_1.z.string().min(1, 'Le sujet est requis.'),
});
/**
 * Generates a new blog post using an AI flow based on a given topic.
 * @param {Request} req - The Express request object, containing the topic in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the AI-generated blog post content.
 */
const generateBlogPost = async (req, res) => {
    try {
        const { topic } = generatePostSchema.parse(req.body);
        const blogPost = await (0, flow_1.runFlow)(aiService.generateBlogPostFlow, topic);
        res.status(200).json(blogPost);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error generating blog post', error });
    }
};
exports.generateBlogPost = generateBlogPost;
