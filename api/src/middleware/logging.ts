// src/middleware/logging.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const THREAT_PATTERNS = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/, // SQL Injection
    /(<script>)|(&lt;script&gt;)/, // XSS
    /(\.\.\/)/, // Path Traversal
];

function isPotentialThreat(text: string): boolean {
    return THREAT_PATTERNS.some(pattern => pattern.test(text));
}

export const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // 1. IP Blocking Check
    try {
        const blocked = await prisma.blockedIP.findUnique({ where: { ip } });
        if (blocked) {
            return res.status(403).json({ message: 'Forbidden: Your IP address has been blocked.' });
        }
    } catch (error) {
        // If the DB check fails, we'll proceed but log the error.
        console.error("Error checking blocked IP:", error);
    }

    // 2. Request Logging
    const originalSend = res.send;
    res.on('finish', async () => {
        try {
            const fullUrl = req.originalUrl || req.url;
            const userAgent = req.get('User-Agent') || '';
            
            // 3. Threat Detection
            const isThreat = isPotentialThreat(decodeURIComponent(fullUrl)) || isPotentialThreat(JSON.stringify(req.body));

            await prisma.requestLog.create({
                data: {
                    ip,
                    method: req.method,
                    path: fullUrl,
                    statusCode: res.statusCode,
                    userAgent,
                    isThreat,
                },
            });
        } catch (error) {
            console.error('Failed to log request:', error);
        }
    });

    next();
};
