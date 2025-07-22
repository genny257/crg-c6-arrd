// src/services/donation.service.ts
import { PrismaClient, Donation, DonationStatus } from '@prisma/client';
const prisma = new PrismaClient();

export const createDonation = async (data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation> => {
    return await prisma.donation.create({ data });
};

export const updateDonationStatus = async (id: string, status: DonationStatus): Promise<Donation> => {
    return await prisma.donation.update({
        where: { id },
        data: { status },
    });
};

export const getAllDonations = async (): Promise<Donation[]> => {
    return await prisma.donation.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};
