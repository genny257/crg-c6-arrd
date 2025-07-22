"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.unblockIP = exports.blockIP = exports.getBlockedIPs = exports.getThreats = exports.getTraffic = void 0;
// src/services/admin.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTraffic = async (page, limit) => {
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
exports.getTraffic = getTraffic;
const getThreats = async (page, limit) => {
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
exports.getThreats = getThreats;
const getBlockedIPs = async () => {
    return await prisma.blockedIP.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getBlockedIPs = getBlockedIPs;
const blockIP = async (ip, reason) => {
    return await prisma.blockedIP.create({
        data: { ip, reason },
    });
};
exports.blockIP = blockIP;
const unblockIP = async (id) => {
    return await prisma.blockedIP.delete({ where: { id } });
};
exports.unblockIP = unblockIP;
const getStats = async () => {
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
};
exports.getStats = getStats;
