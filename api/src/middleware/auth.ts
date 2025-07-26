// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    const token = bearer.split(' ')[1].trim();
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user as any;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.SUPERADMIN) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};
