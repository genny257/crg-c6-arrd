// src/services/mission.service.ts
import { PrismaClient, Mission } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Récupère toutes les missions de la base de données.
 * @returns Une promesse qui se résout en un tableau de toutes les missions.
 */
export const getAllMissions = async (): Promise<Mission[]> => {
  return await prisma.mission.findMany({
    include: {
      participants: true, // Inclure les volontaires liés
    },
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
export const createMission = async (data: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mission> => {
  return await prisma.mission.create({
    data,
  });
};

/**
 * Met à jour une mission existante.
 * @param id - L'ID de la mission à mettre à jour.
 * @param data - Les données à mettre à jour.
 * @returns Une promesse qui se résout en la mission mise à jour.
 */
export const updateMission = async (id: string, data: Partial<Mission>): Promise<Mission> => {
  return await prisma.mission.update({
    where: { id },
    data,
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