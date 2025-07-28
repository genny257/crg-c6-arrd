
// src/services/donation.service.ts
import { PrismaClient, Donation, DonationStatus } from '@prisma/client';
const prisma = new PrismaClient();

export const createDonation = async (data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt' | 'airtelMoneyId'>): Promise<Donation> => {
    return await prisma.donation.create({ data });
};

export const updateDonationStatus = async (id: string, status: DonationStatus): Promise<Donation> => {
    return await prisma.donation.update({
        where: { id },
        data: { status },
    });
};

export const updateDonationByExternalId = async (externalTransactionId: string, status: DonationStatus, airtelMoneyId: string): Promise<Donation | null> => {
    const donation = await prisma.donation.findUnique({
        where: { externalTransactionId }
    });

    if (!donation) {
        console.error(`Donation with external ID ${externalTransactionId} not found.`);
        return null;
    }

    return await prisma.donation.update({
        where: { id: donation.id },
        data: { status, airtelMoneyId },
    });
}


export const updateDonationWithAirtelId = async (id: string, airtelMoneyId: string): Promise<Donation> => {
    return await prisma.donation.update({
        where: { id },
        data: { airtelMoneyId, status: DonationStatus.CONFIRMED },
    });
};


export const getAllDonations = async (): Promise<Donation[]> => {
    return await prisma.donation.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};
