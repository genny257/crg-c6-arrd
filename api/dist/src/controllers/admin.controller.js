"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.getStats = exports.unblockIP = exports.blockIP = exports.getBlockedIPs = exports.getThreats = exports.getTraffic = void 0;
const adminService = __importStar(require("../services/admin.service"));
const zod_1 = require("zod");
// Schema for validating pagination query parameters
const paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(20),
});
/**
 * Retrieves paginated traffic log data.
 * @param {Request} req - The Express request object, containing pagination info in query params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with traffic data and pagination details.
 */
const getTraffic = async (req, res) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const { data, total } = await adminService.getTraffic(page, limit);
        res.json({ data, total, page, limit });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching traffic data', error });
    }
};
exports.getTraffic = getTraffic;
/**
 * Retrieves paginated security threat data.
 * @param {Request} req - The Express request object, containing pagination info in query params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with threat data and pagination details.
 */
const getThreats = async (req, res) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const { data, total } = await adminService.getThreats(page, limit);
        res.json({ data, total, page, limit });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching threat data', error });
    }
};
exports.getThreats = getThreats;
/**
 * Retrieves a list of all blocked IP addresses.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response containing the list of blocked IPs.
 */
const getBlockedIPs = async (req, res) => {
    try {
        const ips = await adminService.getBlockedIPs();
        res.json(ips);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching blocked IPs', error });
    }
};
exports.getBlockedIPs = getBlockedIPs;
// Schema for validating the body of a block IP request
const blockIPSchema = zod_1.z.object({
    ip: zod_1.z.string(),
    reason: zod_1.z.string().optional(),
});
/**
 * Blocks a new IP address.
 * @param {Request} req - The Express request object, containing the IP and reason in the body.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with the newly created blocked IP record.
 */
const blockIP = async (req, res) => {
    try {
        const { ip, reason } = blockIPSchema.parse(req.body);
        const blockedIP = await adminService.blockIP(ip, reason);
        res.status(201).json(blockedIP);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error blocking IP', error });
    }
};
exports.blockIP = blockIP;
/**
 * Unblocks an IP address by its ID.
 * @param {Request} req - The Express request object, containing the ID in the params.
 * @param {Response} res - The Express response object.
 * @returns {Response} A 204 No Content response on success.
 */
const unblockIP = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.unblockIP(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error unblocking IP', error });
    }
};
exports.unblockIP = unblockIP;
/**
 * Retrieves general statistics for the admin dashboard.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with various statistics.
 */
const getStats = async (req, res) => {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};
exports.getStats = getStats;
/**
 * Retrieves analytics data for the admin dashboard.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} A JSON response with analytics data.
 */
const getAnalytics = async (req, res) => {
    try {
        const stats = await adminService.getAnalytics();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error });
    }
};
exports.getAnalytics = getAnalytics;
