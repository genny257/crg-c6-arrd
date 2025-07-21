"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMissions = void 0;
// src/services/mission.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Récupère toutes les missions de la base de données, en incluant les participants (volontaires) associés.
 * @returns Une promesse qui se résout en un tableau de toutes les missions.
 */
const getAllMissions = async () => {
    return await prisma.mission.findMany({
        include: {
            participants: true, // Inclure les volontaires liés à chaque mission
        },
    });
};
exports.getAllMissions = getAllMissions;
