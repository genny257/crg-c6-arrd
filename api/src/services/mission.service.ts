// src/services/mission.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Récupère toutes les missions de la base de données, en incluant les participants (volontaires) associés.
 * @returns Une promesse qui se résout en un tableau de toutes les missions.
 */
export const getAllMissions = async () => {
  return await prisma.mission.findMany({
    include: {
      participants: true, // Inclure les volontaires liés à chaque mission
    },
  });
};