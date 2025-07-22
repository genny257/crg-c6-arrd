"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVolunteerStatus = exports.getVolunteerByMatricule = exports.getVolunteerById = exports.createVolunteer = exports.getAllVolunteers = void 0;
// src/services/volunteer.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllVolunteers = async () => {
    return await prisma.user.findMany({
        where: { role: client_1.UserRole.VOLUNTEER },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllVolunteers = getAllVolunteers;
const createVolunteer = async (data) => {
    // TODO: Add more robust validation and data mapping
    return await prisma.user.create({
        data: {
            ...data,
            role: client_1.UserRole.VOLUNTEER,
            birthDate: new Date(data.birthDate), // Ensure date is correctly formatted
        }
    });
};
exports.createVolunteer = createVolunteer;
const getVolunteerById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};
exports.getVolunteerById = getVolunteerById;
const getVolunteerByMatricule = async (matricule) => {
    return await prisma.user.findUnique({
        where: { matricule },
    });
};
exports.getVolunteerByMatricule = getVolunteerByMatricule;
const updateVolunteerStatus = async (id, status) => {
    return await prisma.user.update({
        where: { id },
        data: { status },
    });
};
exports.updateVolunteerStatus = updateVolunteerStatus;
