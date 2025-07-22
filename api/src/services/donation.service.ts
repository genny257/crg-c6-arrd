// src/services/donation.service.ts
import { PrismaClient, Donation } from '@prisma/client';
const prisma = new PrismaClient();

export const createDonation = async (data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation> => {
    return await prisma.donation.create({ data });
};

export const getAllDonations = async (): Promise<Donation[]> => {
    return await prisma.donation.findMany();
};
