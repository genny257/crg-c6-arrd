// src/services/sponsorship.service.ts
import { PrismaClient, CorporateSponsorship } from '@prisma/client';

const prisma = new PrismaClient();

export const createSponsorship = async (data: Omit<CorporateSponsorship, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<CorporateSponsorship> => {
    return await prisma.corporateSponsorship.create({ data });
};

export const getAllSponsorships = async (): Promise<CorporateSponsorship[]> => {
    return await prisma.corporateSponsorship.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};
