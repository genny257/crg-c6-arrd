"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVolunteerStatus = exports.getVolunteerByMatricule = exports.getVolunteerById = exports.createVolunteer = exports.getAllVolunteers = void 0;
// src/services/volunteer.service.ts
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllVolunteers = async () => {
    return await prisma_1.default.user.findMany({
        where: {
            role: client_1.UserRole.VOLUNTEER
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllVolunteers = getAllVolunteers;
const createVolunteer = async (data) => {
    // TODO: Add more robust validation and data mapping
    return await prisma_1.default.user.create({
        data: {
            ...data,
            role: client_1.UserRole.VOLUNTEER,
            birthDate: new Date(data.birthDate), // Ensure date is correctly formatted
        }
    });
};
exports.createVolunteer = createVolunteer;
const getVolunteerById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
    });
    if (user && user.role === client_1.UserRole.VOLUNTEER) {
        return user;
    }
    return null;
};
exports.getVolunteerById = getVolunteerById;
const getVolunteerByMatricule = async (matricule) => {
    const user = await prisma_1.default.user.findUnique({
        where: { matricule },
    });
    if (user && user.role === client_1.UserRole.VOLUNTEER) {
        return user;
    }
    return null;
};
exports.getVolunteerByMatricule = getVolunteerByMatricule;
const updateVolunteerStatus = async (id, status) => {
    return await prisma_1.default.user.update({
        where: { id },
        data: { status },
    });
};
exports.updateVolunteerStatus = updateVolunteerStatus;
