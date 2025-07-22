"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostBySlug = exports.getBlogPostById = exports.createBlogPost = exports.getFeaturedBlogPosts = exports.getAllBlogPosts = void 0;
// src/services/blog.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllBlogPosts = async () => {
    return await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getAllBlogPosts = getAllBlogPosts;
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
const createBlogPost = async (data) => {
    return await prisma.post.create({ data });
};
exports.createBlogPost = createBlogPost;
const getBlogPostById = async (id) => {
    return await prisma.post.findUnique({ where: { id } });
};
exports.getBlogPostById = getBlogPostById;
const getBlogPostBySlug = async (slug) => {
    return await prisma.post.findUnique({ where: { slug } });
};
exports.getBlogPostBySlug = getBlogPostBySlug;
const updateBlogPost = async (id, data) => {
    return await prisma.post.update({ where: { id }, data });
};
exports.updateBlogPost = updateBlogPost;
const deleteBlogPost = async (id) => {
    return await prisma.post.delete({ where: { id } });
};
exports.deleteBlogPost = deleteBlogPost;
