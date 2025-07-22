// src/services/volunteer.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllVolunteers = async () => {
  return await prisma.volunteer.findMany({
    include: {
      profession: true,
      skills: true,
    },
  });
};

export const createVolunteer = async (data: any) => {
  const { skills, profession, residence, ...volunteerData } = data;

  // Handle skills: find or create each skill
  const skillOperations = skills.map((skillName: string) => {
    return prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    });
  });
  const createdSkills = await Promise.all(skillOperations);

  // Handle profession: find or create the profession
  let createdProfession = null;
  if (profession) {
    createdProfession = await prisma.profession.upsert({
      where: { name: profession },
      update: {},
      create: { name: profession },
    });
  }
  
  // Flatten residence data
  const finalVolunteerData = {
    ...volunteerData,
    residenceProvince: residence?.province,
    residenceDepartement: residence?.departement,
    residenceCommuneCanton: residence?.communeCanton,
    residenceArrondissement: residence?.arrondissement,
    residenceQuartierVillage: residence?.quartierVillage,
    professionId: createdProfession?.id,
    skills: {
      connect: createdSkills.map(skill => ({ id: skill.id })),
    },
  };


  return await prisma.volunteer.create({ 
    data: finalVolunteerData,
    include: {
        profession: true,
        skills: true
    }
   });
};

export const getVolunteerById = async (id: string) => {
    return await prisma.volunteer.findUnique({ 
        where: { id },
        include: {
            profession: true,
            skills: true
        }
    });
};

export const updateVolunteer = async (id: string, data: any) => {
    const { skills, profession, ...volunteerData } = data;

    // Handle skills update if provided
    let skillsConnect = undefined;
    if (skills) {
        const skillOperations = skills.map((skillName: string) => {
            return prisma.skill.upsert({
                where: { name: skillName },
                update: {},
                create: { name: skillName },
            });
        });
        const createdSkills = await Promise.all(skillOperations);
        skillsConnect = {
            set: createdSkills.map(skill => ({ id: skill.id })),
        };
    }

    // Handle profession update if provided
    let professionId = undefined;
    if (profession) {
        const createdProfession = await prisma.profession.upsert({
            where: { name: profession },
            update: {},
            create: { name: profession },
        });
        professionId = createdProfession.id;
    }

    return await prisma.volunteer.update({ 
        where: { id }, 
        data: {
            ...volunteerData,
            professionId,
            skills: skillsConnect,
        },
        include: {
            profession: true,
            skills: true
        }
    });
};

export const deleteVolunteer = async (id: string) => {
    return await prisma.volunteer.delete({ where: { id } });
};
