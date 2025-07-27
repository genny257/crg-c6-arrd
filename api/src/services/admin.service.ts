// src/services/admin.service.ts
import { PrismaClient, DonationStatus, MissionStatus, UserStatus } from '@prisma/client';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Retrieves paginated traffic log data from the database.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{data: any[], total: number}>} An object containing the traffic data and total count.
 */
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
    return { data, total };
};

/**
 * Retrieves paginated security threat data from the database.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{data: any[], total: number}>} An object containing the threat data and total count.
 */
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
    return { data, total };
};

/**
 * Retrieves all blocked IP addresses from the database.
 * @returns {Promise<any[]>} A list of all blocked IP objects.
 */
export const getBlockedIPs = async () => {
    return await prisma.blockedIP.findMany({ orderBy: { createdAt: 'desc' } });
};

/**
 * Blocks an IP address by adding it to the database.
 * Throws an error if the IP is already blocked.
 * @param {string} ip - The IP address to block.
 * @param {string} [reason] - The optional reason for blocking the IP.
 * @returns {Promise<any>} The newly created blocked IP object.
 */
export const blockIP = async (ip: string, reason?: string) => {
    // Check if IP is already blocked
    const existing = await prisma.blockedIP.findUnique({ where: { ip } });
    if (existing) {
        throw new Error("Cette adresse IP est déjà bloquée.");
    }
    return await prisma.blockedIP.create({
        data: { ip, reason },
    });
};

/**
 * Unblocks an IP address by deleting it from the database.
 * @param {string} id - The ID of the blocked IP record to delete.
 * @returns {Promise<any>} The result of the deletion.
 */
export const unblockIP = async (id: string) => {
    return await prisma.blockedIP.delete({ where: { id } });
};

/**
 * Retrieves general security and traffic statistics.
 * @returns {Promise<object>} An object containing various site statistics.
 */
export const getStats = async () => {
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
}

/**
 * Retrieves analytics data for the main dashboard, including key metrics and chart data.
 * @returns {Promise<object>} An object containing key metrics and data for charts.
 */
export const getAnalytics = async () => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

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
        const d = subMonths(now, i);
        const monthStart = startOfMonth(d);
        const monthEnd = endOfMonth(d);
        
        const volunteerCount = await prisma.user.count({
            where: { role: 'VOLUNTEER', createdAt: { lt: monthEnd } }
        });
        volunteersHistory.push({ name: format(d, 'MMM'), count: volunteerCount });

        const donationSum = await prisma.donation.aggregate({
            _sum: { amount: true },
            where: { status: 'CONFIRMED', createdAt: { gte: monthStart, lt: monthEnd } }
        });
        donationsHistory.push({ name: format(d, 'MMM'), total: donationSum._sum.amount || 0 });
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
