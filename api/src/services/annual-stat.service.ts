// src/services/annual-stat.service.ts
import prisma from '../lib/prisma';
import type { Prisma, AnnualStat } from '@prisma/client';

export const getPublicStats = async (): Promise<AnnualStat[]> => {
    return await prisma.annualStat.findMany({
        where: { isVisible: true },
        orderBy: { year: 'desc' },
    });
};

export const getAllStats = async (): Promise<AnnualStat[]> => {
    return await prisma.annualStat.findMany({
        orderBy: { year: 'desc' },
    });
};

export const createStat = async (data: Prisma.AnnualStatCreateInput): Promise<AnnualStat> => {
    return await prisma.annualStat.create({ data });
};

export const updateStat = async (id: string, data: Prisma.AnnualStatUpdateInput): Promise<AnnualStat> => {
    return await prisma.annualStat.update({
        where: { id },
        data,
    });
};

export const deleteStat = async (id: string): Promise<AnnualStat> => {
    return await prisma.annualStat.delete({
        where: { id },
    });
};
