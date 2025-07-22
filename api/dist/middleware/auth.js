"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = bearer.split(' ')[1].trim();
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_default_secret');
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
exports.protect = protect;
const isSuperAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.UserRole.SUPERADMIN) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};
exports.isSuperAdmin = isSuperAdmin;
