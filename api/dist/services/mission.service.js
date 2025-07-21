"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMission = exports.updateMission = exports.createMission = exports.getMissionById = exports.getAllMissions = void 0;
// src/services/mission.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Récupère toutes les missions de la base de données.
 * @returns Une promesse qui se résout en un tableau de toutes les missions.
 */
const getAllMissions = async () => {
    return await prisma.mission.findMany({
        include: {
            participants: true, // Inclure les volontaires liés
        },
    });
};
exports.getAllMissions = getAllMissions;
/**
 * Récupère une mission par son ID.
 * @param id - L'ID de la mission à récupérer.
 * @returns Une promesse qui se résout en la mission trouvée ou null.
 */
const getMissionById = async (id) => {
    return await prisma.mission.findUnique({
        where: { id },
        include: {
            participants: true,
        },
    });
};
exports.getMissionById = getMissionById;
/**
 * Crée une nouvelle mission.
 * @param data - Les données de la mission à créer.
 * @returns Une promesse qui se résout en la nouvelle mission créée.
 */
const createMission = async (data) => {
    return await prisma.mission.create({
        data,
    });
};
exports.createMission = createMission;
/**
 * Met à jour une mission existante.
 * @param id - L'ID de la mission à mettre à jour.
 * @param data - Les données à mettre à jour.
 * @returns Une promesse qui se résout en la mission mise à jour.
 */
const updateMission = async (id, data) => {
    return await prisma.mission.update({
        where: { id },
        data,
    });
};
exports.updateMission = updateMission;
/**
 * Supprime une mission.
 * @param id - L'ID de la mission à supprimer.
 * @returns Une promesse qui se résout lorsque la mission est supprimée.
 */
const deleteMission = async (id) => {
    await prisma.mission.delete({
        where: { id },
    });
};
exports.deleteMission = deleteMission;
