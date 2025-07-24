"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostBySlug = exports.getBlogPostById = exports.createBlogPost = exports.getFeaturedBlogPosts = exports.getAllBlogPosts = void 0;
// src/services/blog.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Retrieves all blog posts from the database, ordered by creation date.
 * @returns {Promise<Post[]>} A list of all blog posts.
 */
const getAllBlogPosts = async () => {
    return await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getAllBlogPosts = getAllBlogPosts;
/**
 * Retrieves the top 3 featured blog posts that are visible and have an image.
 * @returns {Promise<Post[]>} A list of featured blog posts.
 */
const getFeaturedBlogPosts = async () => {
    return await prisma.post.findMany({
        where: {
            image: {
                not: null,
            },
            visible: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    });
};
exports.getFeaturedBlogPosts = getFeaturedBlogPosts;
/**
 * Creates a new blog post in the database.
 * @param {any} data - The data for the new blog post.
 * @returns {Promise<Post>} The newly created blog post.
 */
const createBlogPost = async (data) => {
    return await prisma.post.create({ data });
};
exports.createBlogPost = createBlogPost;
/**
 * Retrieves a single blog post by its ID.
 * @param {string} id - The ID of the blog post to retrieve.
 * @returns {Promise<Post | null>} The blog post if found, otherwise null.
 */
const getBlogPostById = async (id) => {
    return await prisma.post.findUnique({ where: { id } });
};
exports.getBlogPostById = getBlogPostById;
/**
 * Retrieves a single blog post by its unique slug.
 * @param {string} slug - The slug of the blog post to retrieve.
 * @returns {Promise<Post | null>} The blog post if found, otherwise null.
 */
const getBlogPostBySlug = async (slug) => {
    return await prisma.post.findUnique({ where: { slug } });
};
exports.getBlogPostBySlug = getBlogPostBySlug;
/**
 * Updates an existing blog post in the database.
 * @param {string} id - The ID of the blog post to update.
 * @param {any} data - The new data for the blog post.
 * @returns {Promise<Post>} The updated blog post.
 */
const updateBlogPost = async (id, data) => {
    return await prisma.post.update({ where: { id }, data });
};
exports.updateBlogPost = updateBlogPost;
/**
 * Deletes a blog post from the database.
 * @param {string} id - The ID of the blog post to delete.
 * @returns {Promise<Post>} The deleted blog post object.
 */
const deleteBlogPost = async (id) => {
    return await prisma.post.delete({ where: { id } });
};
exports.deleteBlogPost = deleteBlogPost;
