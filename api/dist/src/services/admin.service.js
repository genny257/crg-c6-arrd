"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.getStats = exports.unblockIP = exports.blockIP = exports.getBlockedIPs = exports.getThreats = exports.getTraffic = void 0;
// src/services/admin.service.ts
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
/**
 * Retrieves paginated traffic log data from the database.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{data: any[], total: number}>} An object containing the traffic data and total count.
 */
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
    return { data, total };
};
exports.getTraffic = getTraffic;
/**
 * Retrieves paginated security threat data from the database.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{data: any[], total: number}>} An object containing the threat data and total count.
 */
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
    return { data, total };
};
exports.getThreats = getThreats;
/**
 * Retrieves all blocked IP addresses from the database.
 * @returns {Promise<any[]>} A list of all blocked IP objects.
 */
const getBlockedIPs = async () => {
    return await prisma.blockedIP.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getBlockedIPs = getBlockedIPs;
/**
 * Blocks an IP address by adding it to the database.
 * Throws an error if the IP is already blocked.
 * @param {string} ip - The IP address to block.
 * @param {string} [reason] - The optional reason for blocking the IP.
 * @returns {Promise<any>} The newly created blocked IP object.
 */
const blockIP = async (ip, reason) => {
    // Check if IP is already blocked
    const existing = await prisma.blockedIP.findUnique({ where: { ip } });
    if (existing) {
        throw new Error("IP address is already blocked.");
    }
    return await prisma.blockedIP.create({
        data: { ip, reason },
    });
};
exports.blockIP = blockIP;
/**
 * Unblocks an IP address by deleting it from the database.
 * @param {string} id - The ID of the blocked IP record to delete.
 * @returns {Promise<any>} The result of the deletion.
 */
const unblockIP = async (id) => {
    return await prisma.blockedIP.delete({ where: { id } });
};
exports.unblockIP = unblockIP;
/**
 * Retrieves general security and traffic statistics.
 * @returns {Promise<object>} An object containing various site statistics.
 */
const getStats = async () => {
    const totalRequests = await prisma.requestLog.count();
    const totalThreats = await prisma.requestLog.count({ where: { isThreat: true } });
    const totalBlocked = await prisma.blockedIP.count();
    // Get unique visitors in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const uniqueVisitorsLast24h = await prisma.requestLog.groupBy({
        by: ['ip'],
        where: {
            createdAt: {
                gte: twentyFourHoursAgo,
            },
        },
    });
    return {
        totalRequests,
        totalThreats,
        totalBlocked,
        uniqueVisitors: uniqueVisitorsLast24h.length
    };
};
exports.getStats = getStats;
/**
 * Retrieves analytics data for the main dashboard, including key metrics and chart data.
 * @returns {Promise<object>} An object containing key metrics and data for charts.
 */
const getAnalytics = async () => {
    const now = new Date();
    const thisMonthStart = (0, date_fns_1.startOfMonth)(now);
    const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
    const lastMonthEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
    // Key Metrics
    const activeVolunteers = await prisma.user.count({ where: { role: 'VOLUNTEER', status: 'ACTIVE' } });
    const newVolunteersThisMonth = await prisma.user.count({ where: { role: 'VOLUNTEER', createdAt: { gte: thisMonthStart } } });
    const ongoingMissions = await prisma.mission.count({ where: { status: 'IN_PROGRESS' } });
    const donationsThisMonthResult = await prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: 'CONFIRMED', createdAt: { gte: thisMonthStart } }
    });
    const donationsThisMonth = donationsThisMonthResult._sum.amount || 0;
    const donationsLastMonthResult = await prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: 'CONFIRMED', createdAt: { gte: lastMonthStart, lt: lastMonthEnd } }
    });
    const donationsLastMonth = donationsLastMonthResult._sum.amount || 0;
    const donationChangePercentage = donationsLastMonth > 0 ? ((donationsThisMonth - donationsLastMonth) / donationsLastMonth) * 100 : (donationsThisMonth > 0 ? 100 : 0);
    const assignedVolunteers = await prisma.mission.findMany({
        where: { status: 'IN_PROGRESS' },
        include: { _count: { select: { participants: true } } }
    });
    const totalAssigned = assignedVolunteers.reduce((sum, m) => sum + m._count.participants, 0);
    const engagementRate = activeVolunteers > 0 ? (totalAssigned / activeVolunteers) * 100 : 0;
    // Chart Data
    const volunteersHistory = [];
    const donationsHistory = [];
    for (let i = 5; i >= 0; i--) {
        const d = (0, date_fns_1.subMonths)(now, i);
        const monthStart = (0, date_fns_1.startOfMonth)(d);
        const monthEnd = (0, date_fns_1.endOfMonth)(d);
        const volunteerCount = await prisma.user.count({
            where: { role: 'VOLUNTEER', createdAt: { lt: monthEnd } }
        });
        volunteersHistory.push({ name: (0, date_fns_1.format)(d, 'MMM'), count: volunteerCount });
        const donationSum = await prisma.donation.aggregate({
            _sum: { amount: true },
            where: { status: 'CONFIRMED', createdAt: { gte: monthStart, lt: monthEnd } }
        });
        donationsHistory.push({ name: (0, date_fns_1.format)(d, 'MMM'), total: donationSum._sum.amount || 0 });
    }
    return {
        keyMetrics: {
            activeVolunteers,
            newVolunteersThisMonth,
            ongoingMissions,
            donationsThisMonth,
            donationChangePercentage,
            engagementRate,
        },
        charts: {
            volunteersHistory,
            donationsHistory
        }
    };
};
exports.getAnalytics = getAnalytics;
