"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.createEvent = exports.getFeaturedEvents = exports.getAllEvents = void 0;
// src/services/event.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllEvents = async () => {
    return await prisma.event.findMany({ orderBy: { date: 'desc' } });
};
exports.getAllEvents = getAllEvents;
const getFeaturedEvents = async () => {
    return await prisma.event.findMany({
        where: {
            image: {
                not: null,
            },
            status: 'UPCOMING',
        },
        orderBy: {
            date: 'asc',
        },
        take: 3,
    });
};
exports.getFeaturedEvents = getFeaturedEvents;
const createEvent = async (data) => {
    return await prisma.event.create({ data });
};
exports.createEvent = createEvent;
const getEventById = async (id) => {
    return await prisma.event.findUnique({ where: { id } });
};
exports.getEventById = getEventById;
const updateEvent = async (id, data) => {
    return await prisma.event.update({ where: { id }, data });
};
exports.updateEvent = updateEvent;
const deleteEvent = async (id) => {
    return await prisma.event.delete({ where: { id } });
};
exports.deleteEvent = deleteEvent;
