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
const createUser = async (data) => {
    const { skills, profession, educationLevel, nationality, residence, password, ...userData } = data;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
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
    const skillIds = await Promise.all((skills || []).map((name) => upsertAndGetId('skill', name)));
    const professionId = await upsertAndGetId('profession', profession);
    const educationLevelId = await upsertAndGetId('educationLevel', educationLevel);
    const nationalityId = await upsertAndGetId('nationality', nationality);
    const finalUserData = {
        ...userData,
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
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
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
