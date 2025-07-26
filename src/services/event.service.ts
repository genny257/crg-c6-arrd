// src/services/event.service.ts
import { PrismaClient, Event, EventStatus } from '@prisma/client';
const prisma = new PrismaClient();

type EventData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

export const getAllEvents = async (): Promise<Event[]> => {
    return await prisma.event.findMany({ orderBy: { date: 'desc' } });
};

export const getFeaturedEvents = async (): Promise<Event[]> => {
    return await prisma.event.findMany({
        where: {
            image: {
                not: null,
            },
            status: EventStatus.UPCOMING,
        },
        orderBy: {
            date: 'asc',
        },
        take: 3,
    });
};

export const createEvent = async (data: EventData): Promise<Event> => {
    return await prisma.event.create({ data });
};

export const getEventById = async (id: string): Promise<Event | null> => {
    return await prisma.event.findUnique({ where: { id } });
};

export const updateEvent = async (id: string, data: Partial<EventData>): Promise<Event> => {
    return await prisma.event.update({ where: { id }, data });
};

export const deleteEvent = async (id: string): Promise<Event> => {
    return await prisma.event.delete({ where: { id } });
};
