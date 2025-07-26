// src/services/report.service.ts
import { PrismaClient, Report } from '@prisma/client';
const prisma = new PrismaClient();

type ReportData = Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;

export const getAllReports = async (): Promise<Report[]> => {
    return await prisma.report.findMany({ 
        orderBy: { createdAt: 'desc' }
    });
};

export const createReport = async (data: ReportData): Promise<Report> => {
    return await prisma.report.create({ data });
};

export const getReportById = async (id: string): Promise<Report | null> => {
    return await prisma.report.findUnique({ where: { id } });
};

export const updateReport = async (id: string, data: Partial<ReportData>): Promise<Report> => {
    return await prisma.report.update({ where: { id }, data });
};

export const deleteReport = async (id: string): Promise<Report> => {
    return await prisma.report.delete({ where: { id } });
};
