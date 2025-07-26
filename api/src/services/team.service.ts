// src/services/team.service.ts
import prisma from '../lib/prisma';
import { TeamStructure, TeamMember, Pool } from '../types/team';
import type { TeamPool, TeamRole, User, Prisma } from '@prisma/client';
import { UserRole as PrismaUserRole } from '@prisma/client';

const userToTeamMember = (user: any): TeamMember => ({
    name: user ? `${user.firstName} ${user.lastName}` : "Non assigné",
    role: user?.teamRole?.name || "Rôle non défini",
    avatar: user?.photo || "https://placehold.co/100x100.png",
    hint: user ? (user.sex === 'féminin' ? 'female portrait' : 'male portrait') : "placeholder"
});

const defaultMember = (roleName: string): TeamMember => ({
    name: "Non assigné",
    role: roleName,
    avatar: "https://placehold.co/100x100.png",
    hint: "placeholder"
});

export const getTeamStructure = async (): Promise<TeamStructure> => {
    
    const presidentUser = await prisma.user.findFirst({ 
        where: { teamRole: { name: 'Président du Comité' } },
        include: { teamRole: true } 
    });
    const vicePresidentUser = await prisma.user.findFirst({ 
        where: { teamRole: { name: 'Vice-Présidente' } },
        include: { teamRole: true } 
    });
    const focalPointUsers = await prisma.user.findMany({ 
        where: { teamRole: { name: 'Point Focal' } },
        include: { teamRole: true } 
    });
     const coordinatorUsers = await prisma.user.findMany({ 
        where: { teamRole: { name: 'Coordinateur' } },
        include: { teamRole: true } 
    });
    
    const dbPools = await prisma.teamPool.findMany({
        include: {
            coordinators: {
                include: {
                    teamRole: true
                }
            }
        }
    });

    const operationalPools: Pool[] = dbPools
        .filter(p => p.type === 'OPERATIONAL')
        .map(p => ({
            name: p.name,
            mission: p.description || '',
            iconKey: p.iconKey || 'Network',
            coordinators: p.coordinators.map(userToTeamMember)
        }));

    const supportPools: Pool[] = dbPools
        .filter(p => p.type === 'SUPPORT')
        .map(p => ({
            name: p.name,
            mission: p.description || '',
            iconKey: p.iconKey || 'Network',
            coordinators: p.coordinators.map(userToTeamMember)
        }));


    return {
        president: presidentUser ? userToTeamMember(presidentUser) : defaultMember("Président du Comité"),
        vicePresident: vicePresidentUser ? userToTeamMember(vicePresidentUser) : defaultMember("Vice-Présidente"),
        focalPoints: focalPointUsers.length > 0 ? focalPointUsers.map(userToTeamMember) : [defaultMember("Point Focal"), defaultMember("Point Focal")],
        coordinators: coordinatorUsers.length > 0 ? coordinatorUsers.map(user => ({...userToTeamMember(user), role: user.assignedCell || 'Coordinateur'})) : [defaultMember("Coordinateur")],
        operationalPools,
        supportPools
    };
};

// --- Team Role Management ---
export const getAllTeamRoles = async (): Promise<TeamRole[]> => {
    return prisma.teamRole.findMany();
};

export const createTeamRole = async (data: Prisma.TeamRoleCreateInput): Promise<TeamRole> => {
    return prisma.teamRole.create({ data });
};

export const updateTeamRole = async (id: string, data: Prisma.TeamRoleUpdateInput): Promise<TeamRole> => {
    return prisma.teamRole.update({ where: { id }, data });
};

export const deleteTeamRole = async (id: string): Promise<TeamRole> => {
    return prisma.teamRole.delete({ where: { id } });
};

// --- Team Pool Management ---
export const getAllTeamPools = async (): Promise<TeamPool[]> => {
    return prisma.teamPool.findMany({ include: { coordinators: true } });
};

export const createTeamPool = async (data: Prisma.TeamPoolCreateInput): Promise<TeamPool> => {
    return prisma.teamPool.create({ data });
};

export const updateTeamPool = async (id: string, data: Prisma.TeamPoolUpdateInput): Promise<TeamPool> => {
    return prisma.teamPool.update({ where: { id }, data });
};

export const deleteTeamPool = async (id: string): Promise<TeamPool> => {
    return prisma.teamPool.delete({ where: { id } });
};

// --- Assignment Management ---
export const assignUserToRole = async (userId: string, roleId: string | null): Promise<User> => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            teamRoleId: roleId,
        },
    });
};

export const assignCoordinatorToPool = async (poolId: string, userId: string): Promise<TeamPool> => {
    return prisma.teamPool.update({
        where: { id: poolId },
        data: {
            coordinators: {
                connect: { id: userId },
            },
        },
    });
};

export const removeCoordinatorFromPool = async (poolId: string, userId: string): Promise<TeamPool> => {
    return prisma.teamPool.update({
        where: { id: poolId },
        data: {
            coordinators: {
                disconnect: { id: userId },
            },
        },
    });
};
