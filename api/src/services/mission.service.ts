
// src/services/mission.service.ts
import { PrismaClient, Mission, MissionStatus, UserStatus } from '@prisma/client';
const prisma = new PrismaClient();

// Définir un type pour les données de création validées
type CreateMissionData = Omit<Mission, 'id' | 'createdAt' | 'updatedAt'> & {
    requiredSkills?: string[];
};

/**
 * Récupère toutes les missions de la base de données.
 * @returns Une promesse qui se résout en un tableau de toutes les missions.
 */
export const getAllMissions = async (): Promise<Mission[]> => {
  return await prisma.mission.findMany({
    include: {
      participants: true, // Inclure les volontaires liés
    },
    orderBy: {
      startDate: 'desc',
    }
  });
};

/**
 * Récupère une mission par son ID.
 * @param id - L'ID de la mission à récupérer.
 * @returns Une promesse qui se résout en la mission trouvée ou null.
 */
export const getMissionById = async (id: string): Promise<Mission | null> => {
  return await prisma.mission.findUnique({
    where: { id },
    include: {
      participants: true,
    },
  });
};

/**
 * Crée une nouvelle mission.
 * @param data - Les données de la mission à créer.
 * @returns Une promesse qui se résout en la nouvelle mission créée.
 */
export const createMission = async (data: CreateMissionData): Promise<Mission> => {
  return await prisma.mission.create({
    data: {
      ...data,
      requiredSkills: { set: data.requiredSkills || [] },
    },
  });
};

/**
 * Met à jour une mission existante.
 * @param id - L'ID de la mission à mettre à jour.
 * @param data - Les données à mettre à jour.
 * @returns Une promesse qui se résout en la mission mise à jour.
 */
export const updateMission = async (id: string, data: Partial<CreateMissionData>): Promise<Mission> => {
  const { requiredSkills, ...restOfData } = data;
  return await prisma.mission.update({
    where: { id },
    data: {
        ...restOfData,
        ...(requiredSkills && { requiredSkills: { set: requiredSkills } }),
    },
  });
};

/**
 * Supprime une mission.
 * @param id - L'ID de la mission à supprimer.
 * @returns Une promesse qui se résout lorsque la mission est supprimée.
 */
export const deleteMission = async (id: string): Promise<void> => {
  await prisma.mission.delete({
    where: { id },
  });
};

/**
 * Inscrit un volontaire à une mission en utilisant son matricule.
 * @param missionId - L'ID de la mission.
 * @param matricule - Le matricule du volontaire.
 * @returns Un objet indiquant le succès et un message.
 */
export const registerVolunteerToMission = async (missionId: string, matricule: string) => {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: { participants: true },
  });

  if (!mission) {
    return { success: false, message: 'Mission non trouvée.' };
  }
  
  if (mission.status !== MissionStatus.PLANNED && mission.status !== MissionStatus.IN_PROGRESS) {
    return { success: false, message: "Les inscriptions pour cette mission sont closes." };
  }

  if (mission.maxParticipants && mission.participants.length >= mission.maxParticipants) {
    return { success: false, message: "La mission a déjà atteint son nombre maximum de participants." };
  }

  const volunteer = await prisma.user.findUnique({ where: { matricule } });

  if (!volunteer) {
    return { success: false, message: `Aucun volontaire trouvé avec le matricule ${matricule}.` };
  }
  
  if (volunteer.status !== UserStatus.ACTIVE) {
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
