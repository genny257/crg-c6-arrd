// src/routes/generic.routes.ts
import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

const models = [
    'skill', 
    'profession', 
    'educationLevel', 
    'nationality',
    'province',
    'departement',
    'communeCanton',
    'arrondissement',
    'quartierVillage'
];

models.forEach(model => {
    // Handle the irregular plural of 'nationality' and force lowercase
    let routeName;
    if (model === 'nationality') {
        routeName = 'nationalities';
    } else {
        // Force lowercase and add 's' for pluralization
        routeName = `${model.toLowerCase()}s`;
    }
    
    router.get(`/${routeName}`, async (req: Request, res: Response) => {
        try {
            const items = await (prisma as any)[model].findMany({
                orderBy: {
                    name: 'asc'
                }
            });
            res.json(items.map((item: { name: string }) => item.name));
        } catch (error) {
            res.status(500).json({ message: `Error fetching ${model}s`, error });
        }
    });
});

export default router;
