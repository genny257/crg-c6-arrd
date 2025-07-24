"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.findUserByEmail = exports.createUser = void 0;
// src/services/user.service.ts
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
/**
 * Creates a new user in the database with hashed password and relational data.
 * Handles dynamic creation of related entities like skills, profession, etc.
 * @param {any} data - The user data from the request body.
 * @returns {Promise<User>} The newly created user object.
 */
const createUser = async (data) => {
    const { skills, profession, educationLevel, nationality, residence, password, ...userData } = data;
    // Generate a unique matricule
    const totalUsers = await prisma.user.count();
    const matricule = `VOL-${(totalUsers + 1).toString().padStart(6, '0')}`;
    // Hash the user's password for security
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    /**
     * Helper function to find or create a related entity (like a skill or profession)
     * and return its ID. This avoids creating duplicate entries.
     * @param model - The Prisma model to query ('skill', 'profession', etc.).
     * @param name - The name of the entity to find or create.
     * @returns {Promise<string|null>} The ID of the entity, or null if name is not provided.
     */
    const upsertAndGetId = async (model, name) => {
        if (!name)
            return null;
        const result = await prisma[model].upsert({
            where: { name },
            update: {},
            create: { name },
        });
        return result.id;
    };
    // Process skills and other relational data
    const skillIds = await Promise.all((skills || []).map((name) => upsertAndGetId('skill', name)));
    const professionId = await upsertAndGetId('profession', profession);
    const educationLevelId = await upsertAndGetId('educationLevel', educationLevel);
    const nationalityId = await upsertAndGetId('nationality', nationality);
    // Prepare the final user data object for Prisma
    const finalUserData = {
        ...userData,
        matricule,
        password: hashedPassword,
        residenceProvince: residence === null || residence === void 0 ? void 0 : residence.province,
        residenceDepartement: residence === null || residence === void 0 ? void 0 : residence.departement,
        residenceCommuneCanton: residence === null || residence === void 0 ? void 0 : residence.communeCanton,
        residenceArrondissement: residence === null || residence === void 0 ? void 0 : residence.arrondissement,
        residenceQuartierVillage: residence === null || residence === void 0 ? void 0 : residence.quartierVillage,
        professionId,
        educationLevelId,
        nationalityId,
        skills: {
            connect: skillIds.filter(id => id).map(id => ({ id })),
        },
    };
    return await prisma.user.create({ data: finalUserData });
};
exports.createUser = createUser;
/**
 * Finds a user by their email address.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<User | null>} The user object if found, otherwise null.
 */
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
/**
 * Retrieves all users from the database with a limited set of fields.
 * @returns {Promise<Partial<User>[]>} A promise that resolves to an array of user objects.
 */
const getAllUsers = async () => {
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
exports.getAllUsers = getAllUsers;
