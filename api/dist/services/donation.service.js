"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDonations = exports.updateDonationStatus = exports.createDonation = void 0;
// src/services/donation.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDonation = async (data) => {
    return await prisma.donation.create({ data });
};
exports.createDonation = createDonation;
const updateDonationStatus = async (id, status) => {
    return await prisma.donation.update({
        where: { id },
        data: { status },
    });
};
exports.updateDonationStatus = updateDonationStatus;
const getAllDonations = async () => {
    return await prisma.donation.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};
exports.getAllDonations = getAllDonations;
