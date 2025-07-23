// src/services/volunteer.service.ts
import { PrismaClient, User, UserRole, UserStatus } from '@prisma/client';
import prisma from '../lib/prisma';

export const getAllVolunteers = async (): Promise<User[]> => {
    return await prisma.user.findMany({
        where: {
            role: UserRole.VOLUNTEER
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const createVolunteer = async (data: any): Promise<User> => {
    // TODO: Add more robust validation and data mapping
    return await prisma.user.create({
        data: {
            ...data,
            role: UserRole.VOLUNTEER,
            birthDate: new Date(data.birthDate), // Ensure date is correctly formatted
        }
    });
};

export const getVolunteerById = async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    if (user && user.role === UserRole.VOLUNTEER) {
        return user;
    }
    return null;
};

export const getVolunteerByMatricule = async (matricule: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { matricule },
    });
    if (user && user.role === UserRole.VOLUNTEER) {
        return user;
    }
    return null;
};


export const updateVolunteerStatus = async (id: string, status: UserStatus): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data: { status },
    });
};
