// src/services/mission.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllMissions = async () => {
  return await prisma.mission.findMany({
    include: {
      participants: true, // Include related volunteers
    },
  });
};
