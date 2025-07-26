"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVolunteerToMission = exports.deleteMission = exports.updateMission = exports.createMission = exports.getMissionById = exports.getAllMissions = void 0;
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
        orderBy: {
            startDate: 'desc',
        }
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
/**
 * Inscrit un volontaire à une mission en utilisant son matricule.
 * @param missionId - L'ID de la mission.
 * @param matricule - Le matricule du volontaire.
 * @returns Un objet indiquant le succès et un message.
 */
const registerVolunteerToMission = async (missionId, matricule) => {
    const mission = await prisma.mission.findUnique({
        where: { id: missionId },
        include: { participants: true },
    });
    if (!mission) {
        return { success: false, message: 'Mission non trouvée.' };
    }
    if (mission.status !== client_1.MissionStatus.PLANNED && mission.status !== client_1.MissionStatus.IN_PROGRESS) {
        return { success: false, message: "Les inscriptions pour cette mission sont closes." };
    }
    if (mission.maxParticipants && mission.participants.length >= mission.maxParticipants) {
        return { success: false, message: "La mission a déjà atteint son nombre maximum de participants." };
    }
    const volunteer = await prisma.user.findUnique({ where: { matricule } });
    if (!volunteer) {
        return { success: false, message: `Aucun volontaire trouvé avec le matricule ${matricule}.` };
    }
    if (volunteer.status !== client_1.UserStatus.ACTIVE) {
        return { success: false, message: `Le volontaire avec le matricule ${matricule} n'a pas un statut "Actif".` };
    }
    const isAlreadyRegistered = mission.participants.some(p => p.id === volunteer.id);
    if (isAlreadyRegistered) {
        return { success: false, message: 'Vous êtes déjà inscrit à cette mission.' };
    }
    await prisma.mission.update({
        where: { id: missionId },
        data: {
            participants: {
                connect: { id: volunteer.id },
            },
        },
    });
    return { success: true, message: 'Inscription réussie ! Vous recevrez bientôt plus de détails.' };
};
exports.registerVolunteerToMission = registerVolunteerToMission;
