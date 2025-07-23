
// src/services/user.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createUser = async (data: any) => {
  const { skills, profession, educationLevel, nationality, residence, password, ...userData } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const upsertAndGetId = async (model: 'skill' | 'profession' | 'educationLevel' | 'nationality', name: string) => {
    if (!name) return null;
    const result = await (prisma as any)[model].upsert({
      where: { name },
      update: {},
      create: { name },
    });
    return result.id;
  };

  const skillIds = await Promise.all(
    (skills || []).map((name: string) => upsertAndGetId('skill', name))
  );
  
  const professionId = await upsertAndGetId('profession', profession);
  const educationLevelId = await upsertAndGetId('educationLevel', educationLevel);
  const nationalityId = await upsertAndGetId('nationality', nationality);

  const finalUserData = {
    ...userData,
    password: hashedPassword,
    residenceProvince: residence?.province,
    residenceDepartement: residence?.departement,
    residenceCommuneCanton: residence?.communeCanton,
    residenceArrondissement: residence?.arrondissement,
    residenceQuartierVillage: residence?.quartierVillage,
    professionId,
    educationLevelId,
    nationalityId,
    skills: {
      connect: skillIds.filter(id => id).map(id => ({ id })),
    },
  };

  return await prisma.user.create({ data: finalUserData });
};

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
};

export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        }
    });
}
