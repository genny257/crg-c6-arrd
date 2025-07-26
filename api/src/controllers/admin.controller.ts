// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import { z } from 'zod';

// Schema for validating pagination query parameters
const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
});

/**
 * Retrieves paginated traffic log data.
 * @param {Request} req - The Express request object, containing pagination info in query params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with traffic data and pagination details.
 */
export const getTraffic = async (req: Request, res: Response) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const {data, total} = await adminService.getTraffic(page, limit);
        res.json({data, total, page, limit});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching traffic data', error });
    }
};

/**
 * Retrieves paginated security threat data.
 * @param {Request} req - The Express request object, containing pagination info in query params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with threat data and pagination details.
 */
export const getThreats = async (req: Request, res: Response) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const {data, total} = await adminService.getThreats(page, limit);
        res.json({data, total, page, limit});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching threat data', error });
    }
};

/**
 * Retrieves a list of all blocked IP addresses.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response containing the list of blocked IPs.
 */
export const getBlockedIPs = async (req: Request, res: Response) => {
    try {
        const ips = await adminService.getBlockedIPs();
        res.json(ips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blocked IPs', error });
    }
};

// Schema for validating the body of a block IP request
const blockIPSchema = z.object({
    ip: z.string().ip({ message: "Adresse IP invalide." }),
    reason: z.string().optional(),
});

/**
 * Blocks a new IP address.
 * @param {Request} req - The Express request object, containing the IP and reason in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the newly created blocked IP record.
 */
export const blockIP = async (req: Request, res: Response) => {
    try {
        const { ip, reason } = blockIPSchema.parse(req.body);
        const blockedIP = await adminService.blockIP(ip, reason);
        res.status(201).json(blockedIP);
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        if (error instanceof Error && error.message.includes("already blocked")) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error blocking IP', error });
    }
};

/**
 * Unblocks an IP address by its ID.
 * @param {Request} req - The Express request object, containing the ID in the params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A 204 No Content response on success.
 */
export const unblockIP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await adminService.unblockIP(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error unblocking IP', error });
    }
};

/**
 * Retrieves general statistics for the admin dashboard.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with various statistics.
 */
export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

/**
 * Retrieves analytics data for the admin dashboard.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with analytics data.
 */
export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getAnalytics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error });
    }
}
