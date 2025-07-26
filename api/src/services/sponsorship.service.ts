// src/services/sponsorship.service.ts
import { PrismaClient, CorporateSponsorship, SponsorshipStatus } from '@prisma/client';

const prisma = new PrismaClient();

type CreateSponsorshipData = Omit<CorporateSponsorship, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

export const createSponsorship = async (data: CreateSponsorshipData): Promise<CorporateSponsorship> => {
    return await prisma.corporateSponsorship.create({ data });
};

export const getAllSponsorships = async (): Promise<CorporateSponsorship[]> => {
    return await prisma.corporateSponsorship.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const updateSponsorshipStatus = async (id: string, status: SponsorshipStatus): Promise<CorporateSponsorship> => {
    return await prisma.corporateSponsorship.update({
        where: { id },
        data: { status },
    });
};
