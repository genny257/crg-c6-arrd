// src/services/report.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllReports = async () => {
    return await prisma.report.findMany({ orderBy: { createdAt: 'desc' } });
};

export const createReport = async (data: any) => {
    return await prisma.report.create({ data });
};

export const getReportById = async (id: string) => {
    return await prisma.report.findUnique({ where: { id } });
};

export const updateReport = async (id: string, data: any) => {
    return await prisma.report.update({ where: { id }, data });
};

export const deleteReport = async (id: string) => {
    return await prisma.report.delete({ where: { id } });
};
