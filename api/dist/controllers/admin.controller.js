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
exports.getStats = exports.unblockIP = exports.blockIP = exports.getBlockedIPs = exports.getThreats = exports.getTraffic = void 0;
const adminService = __importStar(require("../services/admin.service"));
const zod_1 = require("zod");
const paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(20),
});
const getTraffic = async (req, res) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const traffic = await adminService.getTraffic(page, limit);
        res.json(traffic);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching traffic data', error });
    }
};
exports.getTraffic = getTraffic;
const getThreats = async (req, res) => {
    try {
        const { page, limit } = paginationSchema.parse(req.query);
        const threats = await adminService.getThreats(page, limit);
        res.json(threats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching threat data', error });
    }
};
exports.getThreats = getThreats;
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
const blockIPSchema = zod_1.z.object({
    ip: zod_1.z.string(),
    reason: zod_1.z.string().optional(),
});
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
