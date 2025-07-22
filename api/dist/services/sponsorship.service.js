"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSponsorships = exports.createSponsorship = void 0;
// src/services/sponsorship.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSponsorship = async (data) => {
    return await prisma.corporateSponsorship.create({ data });
};
exports.createSponsorship = createSponsorship;
const getAllSponsorships = async () => {
    return await prisma.corporateSponsorship.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllSponsorships = getAllSponsorships;
