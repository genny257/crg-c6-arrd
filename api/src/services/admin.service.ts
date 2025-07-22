// src/services/admin.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTraffic = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
        prisma.requestLog.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.requestLog.count(),
    ]);
    return { data, total, page, limit };
};

export const getThreats = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
        prisma.requestLog.findMany({
            where: { isThreat: true },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.requestLog.count({ where: { isThreat: true } }),
    ]);
    return { data, total, page, limit };
};

export const getBlockedIPs = async () => {
    return await prisma.blockedIP.findMany({ orderBy: { createdAt: 'desc' } });
};

export const blockIP = async (ip: string, reason?: string) => {
    return await prisma.blockedIP.create({
        data: { ip, reason },
    });
};

export const unblockIP = async (id: string) => {
    return await prisma.blockedIP.delete({ where: { id } });
};

export const getStats = async () => {
    const totalRequests = await prisma.requestLog.count();
    const totalThreats = await prisma.requestLog.count({ where: { isThreat: true } });
    const totalBlocked = await prisma.blockedIP.count();
    const uniqueVisitors = await prisma.requestLog.findMany({
        distinct: ['ip']
    });

    return {
        totalRequests,
        totalThreats,
        totalBlocked,
        uniqueVisitors: uniqueVisitors.length
    };
}
