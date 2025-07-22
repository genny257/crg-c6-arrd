// src/services/event.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllEvents = async () => {
    return await prisma.event.findMany({ orderBy: { date: 'desc' } });
};

export const createEvent = async (data: any) => {
    return await prisma.event.create({ data });
};

export const getEventById = async (id: string) => {
    return await prisma.event.findUnique({ where: { id } });
};

export const updateEvent = async (id: string, data: any) => {
    return await prisma.event.update({ where: { id }, data });
};

export const deleteEvent = async (id: string) => {
    return await prisma.event.delete({ where: { id } });
};
