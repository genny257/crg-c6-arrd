// src/services/team.service.ts
import prisma from '../lib/prisma';
import { TeamStructure, TeamMember, Pool } from '../types/team';
import { UserRole }from '@prisma/client';
import { allPoolIcons } from '../lib/icons';


const userToTeamMember = (user: any): TeamMember => ({
    name: `${user.firstName} ${user.lastName}`,
    role: user.specificRole || user.role, // We'll need a way to define specific roles like "Président"
    avatar: user.photo || "https://placehold.co/100x100.png",
    hint: `${user.sex === 'féminin' ? 'female' : 'male'} portrait`
});

// This is a placeholder/mock. In a real scenario, this data would
// likely come from another table that links users to specific pools and roles.
const getPools = async (): Promise<{ operationalPools: Pool[], supportPools: Pool[] }> => {
    // For now, returning a static structure but it's prepared for dynamic data.
    // In the future, we could query a "Pools" table and a "PoolMembers" join table.
    return {
        operationalPools: [
            { name: "Santé", mission: "Promotion de la santé communautaire.", coordinators: [], iconKey: "HeartPulse" },
            { name: "Jeunesse et Volontariat", mission: "Mobilisation des jeunes et des volontaires.", coordinators: [], iconKey: "Users" },
            { name: "Étude de Projet", mission: "Conception et évaluation des projets.", coordinators: [], iconKey: "ClipboardCheck" },
            { name: "Secours", mission: "Interventions d'urgence.", coordinators: [], iconKey: "Siren" },
            { name: "Action Sociale", mission: "Soutien aux populations vulnérables.", coordinators: [], iconKey: "HandHeart" },
            { name: "Assainissement et Hygiène", mission: "Promotion de l'hygiène.", coordinators: [], iconKey: "Soup" },
        ],
        supportPools: [
            { name: "Secrétariat", mission: "Gestion administrative et coordination.", coordinators: [], iconKey: "Archive" },
            { name: "Trésorerie", mission: "Gestion financière.", coordinators: [], iconKey: "Banknote" },
            { name: "Logistique", mission: "Gestion du matériel et des ressources.", coordinators: [], iconKey: "Truck" },
            { name: "Discipline", mission: "Renforcement de l'organisation interne.", coordinators: [], iconKey: "Shield" },
            { name: "Formation", mission: "Développement des compétences.", coordinators: [], iconKey: "GraduationCap" },
        ]
    };
};


export const getTeamStructure = async (): Promise<TeamStructure> => {
    
    // Fetch users with specific roles. This needs the 'role' enum in Prisma schema to be extended.
    // For now, we will assume some roles exist. This part is aspirational until the DB model is updated.
    const presidentUser = await prisma.user.findFirst({ where: { role: UserRole.PRESIDENT } });
    const vicePresidentUser = await prisma.user.findFirst({ where: { role: UserRole.VICE_PRESIDENT } });
    const focalPointUsers = await prisma.user.findMany({ where: { role: UserRole.FOCAL_POINT } });
    const coordinatorUsers = await prisma.user.findMany({ where: { role: UserRole.COORDINATOR } });
    
    // In a real app, you'd fetch pool coordinators from a relational table.
    // For now, we'll return mock pools.
    const { operationalPools, supportPools } = await getPools();

    const defaultMember = (role: string): TeamMember => ({
        name: "Non assigné",
        role,
        avatar: "https://placehold.co/100x100.png",
        hint: "placeholder"
    });

    return {
        president: presidentUser ? userToTeamMember(presidentUser) : defaultMember("Président du Comité"),
        vicePresident: vicePresidentUser ? userToTeamMember(vicePresidentUser) : defaultMember("Vice-Présidente"),
        focalPoints: focalPointUsers.length > 0 ? focalPointUsers.map(userToTeamMember) : [defaultMember("Point Focal 1"), defaultMember("Point Focal 2")],
        coordinators: coordinatorUsers.length > 0 ? coordinatorUsers.map(user => ({...userToTeamMember(user), role: user.assignedCell || 'Coordinateur'})) : [defaultMember("Coordinateur")],
        operationalPools,
        supportPools
    };
};
