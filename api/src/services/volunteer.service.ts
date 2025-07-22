// src/services/volunteer.service.ts
import { PrismaClient, Volunteer, VolunteerStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllVolunteers = async (): Promise<Volunteer[]> => {
    return await prisma.volunteer.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const createVolunteer = async (data: any): Promise<Volunteer> => {
    // TODO: Add more robust validation and data mapping
    return await prisma.volunteer.create({
        data: {
            ...data,
            birthDate: new Date(data.birthDate), // Ensure date is correctly formatted
        }
    });
};

export const getVolunteerById = async (id: string): Promise<Volunteer | null> => {
    return await prisma.volunteer.findUnique({
        where: { id },
    });
};

export const getVolunteerByMatricule = async (matricule: string): Promise<Volunteer | null> => {
    return await prisma.volunteer.findUnique({
        where: { matricule },
    });
};


export const updateVolunteerStatus = async (id: string, status: VolunteerStatus): Promise<Volunteer> => {
    return await prisma.volunteer.update({
        where: { id },
        data: { status },
    });
};
