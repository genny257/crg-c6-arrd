"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/generic.routes.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
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
    router.get(`/${model}s`, async (req, res) => {
        try {
            const items = await prisma[model].findMany({
                orderBy: {
                    name: 'asc'
                }
            });
            res.json(items.map((item) => item.name));
        }
        catch (error) {
            res.status(500).json({ message: `Error fetching ${model}s`, error });
        }
    });
});
exports.default = router;
