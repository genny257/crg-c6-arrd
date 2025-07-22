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
exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostBySlug = exports.getBlogPostById = exports.createBlogPost = exports.getFeaturedBlogPosts = exports.getBlogPosts = void 0;
const blogService = __importStar(require("../services/blog.service"));
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
