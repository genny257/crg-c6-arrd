// src/services/volunteer.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllVolunteers = async () => {
  return await prisma.volunteer.findMany();
};

export const createVolunteer = async (data: any) => {
    return await prisma.volunteer.create({ data });
};

export const getVolunteerById = async (id: string) => {
    return await prisma.volunteer.findUnique({ where: { id } });
};

export const updateVolunteer = async (id: string, data: any) => {
    return await prisma.volunteer.update({ where: { id }, data });
};

export const deleteVolunteer = async (id: string) => {
    return await prisma.volunteer.delete({ where: { id } });
};
