// src/services/user.service.ts
import { PrismaClient, User, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Creates a new user in the database with hashed password and relational data.
 * Handles dynamic creation of related entities like skills, profession, etc.
 * @param {any} data - The user data from the request body.
 * @returns {Promise<User>} The newly created user object.
 */
export const createUser = async (data: any): Promise<User> => {
  const { skills, profession, educationLevel, nationality, residence, password, phone, ...userData } = data;

  // Generate a unique matricule
  const totalUsers = await prisma.user.count();
  const matricule = `VOL-${(totalUsers + 1).toString().padStart(6, '0')}`;

  // Hash the user's password for security
  const hashedPassword = await bcrypt.hash(password, 10);

  /**
   * Helper function to find or create a related entity (like a skill or profession)
   * and return its ID. This avoids creating duplicate entries.
   * @param model - The Prisma model to query ('skill', 'profession', etc.).
   * @param name - The name of the entity to find or create.
   * @returns {Promise<string|null>} The ID of the entity, or null if name is not provided.
   */
  const upsertAndGetId = async (model: 'skill' | 'profession' | 'educationLevel' | 'nationality', name: string): Promise<string | null> => {
    if (!name) return null;
    const result = await (prisma as any)[model].upsert({
      where: { name },
      update: {},
      create: { name },
    });
    return result.id;
  };

  // Process skills and other relational data
  const skillIds = await Promise.all(
    (skills || []).map((name: string) => upsertAndGetId('skill', name))
  );
  
  const professionId = await upsertAndGetId('profession', profession);
  const educationLevelId = await upsertAndGetId('educationLevel', educationLevel);
  const nationalityId = await upsertAndGetId('nationality', nationality);

  // Prepare the final user data object for Prisma
  const finalUserData = {
    ...userData,
    phone,
    matricule,
    password: hashedPassword,
    status: UserStatus.PENDING, // Default status for new registrations
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

/**
 * Finds a user by their email address.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<User | null>} The user object if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { email } });
};

/**
 * Retrieves all users from the database with a limited set of fields.
 * @returns {Promise<Partial<User>[]>} A promise that resolves to an array of user objects.
 */
export const getAllUsers = async (): Promise<Partial<User>[]> => {
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
};

/**
 * Retrieves a full user profile by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any | null>} The full user profile with related data.
 */
export const getUserProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            skills: true,
            profession: true,
            educationLevel: true,
        }
    });
};

/**
 * Updates a user's profile information.
 * @param {string} userId - The ID of the user to update.
 * @param {any} data - The data to update.
 * @returns {Promise<User>} The updated user object.
 */
export const updateUserProfile = async (userId: string, data: any): Promise<User> => {
    const { skills, ...restData } = data;
    
    return await prisma.user.update({
        where: { id: userId },
        data: {
            ...restData,
            ...(skills && {
                skills: {
                    set: [], // Disconnect all existing skills first
                    connectOrCreate: skills.map((name: string) => ({
                        where: { name },
                        create: { name },
                    })),
                },
            }),
        },
    });
};
