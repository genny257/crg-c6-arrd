// src/services/blog.service.ts
import { PrismaClient, Post } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Retrieves all blog posts from the database, ordered by creation date.
 * @returns {Promise<Post[]>} A list of all blog posts.
 */
export const getAllBlogPosts = async (): Promise<Post[]> => {
    return await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
};

/**
 * Retrieves the top 3 featured blog posts that are visible and have an image.
 * @returns {Promise<Post[]>} A list of featured blog posts.
 */
export const getFeaturedBlogPosts = async (): Promise<Post[]> => {
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

/**
 * Creates a new blog post in the database.
 * @param {any} data - The data for the new blog post.
 * @returns {Promise<Post>} The newly created blog post.
 */
export const createBlogPost = async (data: any): Promise<Post> => {
    return await prisma.post.create({ data });
};

/**
 * Retrieves a single blog post by its ID.
 * @param {string} id - The ID of the blog post to retrieve.
 * @returns {Promise<Post | null>} The blog post if found, otherwise null.
 */
export const getBlogPostById = async (id: string): Promise<Post | null> => {
    return await prisma.post.findUnique({ where: { id } });
};

/**
 * Retrieves a single blog post by its unique slug.
 * @param {string} slug - The slug of the blog post to retrieve.
 * @returns {Promise<Post | null>} The blog post if found, otherwise null.
 */
export const getBlogPostBySlug = async (slug: string): Promise<Post | null> => {
    return await prisma.post.findUnique({ where: { slug } });
};

/**
 * Updates an existing blog post in the database.
 * @param {string} id - The ID of the blog post to update.
 * @param {any} data - The new data for the blog post.
 * @returns {Promise<Post>} The updated blog post.
 */
export const updateBlogPost = async (id: string, data: any): Promise<Post> => {
    return await prisma.post.update({ where: { id }, data });
};

/**
 * Deletes a blog post from the database.
 * @param {string} id - The ID of the blog post to delete.
 * @returns {Promise<Post>} The deleted blog post object.
 */
export const deleteBlogPost = async (id: string): Promise<Post> => {
    return await prisma.post.delete({ where: { id } });
};