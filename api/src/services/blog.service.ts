// src/services/blog.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllBlogPosts = async () => {
    return await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
};

export const createBlogPost = async (data: any) => {
    return await prisma.post.create({ data });
};

export const getBlogPostById = async (id: string) => {
    return await prisma.post.findUnique({ where: { id } });
};

export const getBlogPostBySlug = async (slug: string) => {
    return await prisma.post.findUnique({ where: { slug } });
};

export const updateBlogPost = async (id: string, data: any) => {
    return await prisma.post.update({ where: { id }, data });
};

export const deleteBlogPost = async (id: string) => {
    return await prisma.post.delete({ where: { id } });
};
