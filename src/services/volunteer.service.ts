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
         include: {
            skills: { select: { name: true } },
            profession: { select: { name: true } },
        }
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
    // Removed the role check to allow fetching any user by ID,
    // which might be needed for profile pages of admins, etc.
    // The route protection should handle access control.
    return user;
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

export const updateVolunteerFeatureStatus = async (id: string, isFeatured: boolean): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data: { isVolunteerOfTheMonth: isFeatured },
    });
};

export const getVolunteersOfTheMonth = async (): Promise<User[]> => {
    return await prisma.user.findMany({
        where: {
            isVolunteerOfTheMonth: true,
            status: 'ACTIVE'
        },
        take: 3, // Limit to 3 featured volunteers
        select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            assignedCell: true,
            isVolunteerOfTheMonth: true,
        }
    });
};
