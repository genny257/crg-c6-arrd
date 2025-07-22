// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import { z } from 'zod';

const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
});

export const getTraffic = async (req: Request, res: Response) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const traffic = await adminService.getTraffic(page, limit);
        res.json(traffic);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching traffic data', error });
    }
};

export const getThreats = async (req: Request, res: Response) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const threats = await adminService.getThreats(page, limit);
        res.json(threats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching threat data', error });
    }
};

export const getBlockedIPs = async (req: Request, res: Response) => {
    try {
        const ips = await adminService.getBlockedIPs();
        res.json(ips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blocked IPs', error });
    }
};

const blockIPSchema = z.object({
    ip: z.string().ip("Invalid IP address format"),
    reason: z.string().optional(),
});

export const blockIP = async (req: Request, res: Response) => {
    try {
        const { ip, reason } = blockIPSchema.parse(req.body);
        const blockedIP = await adminService.blockIP(ip, reason);
        res.status(201).json(blockedIP);
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Error blocking IP', error });
    }
};

export const unblockIP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await adminService.unblockIP(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error unblocking IP', error });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};
