"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionAssignmentFlow = exports.chatbotFlow = void 0;
// src/services/ai.service.ts
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
// Schemas
const MessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'model']),
    content: zod_1.z.string(),
});
// Tools
const getMissionsTool = (0, flow_1.tool)({
    name: 'getAvailableMissions',
    description: 'Get a list of currently available missions that are planned or in progress.',
}, async () => {
    const missions = await prisma_1.default.mission.findMany({
        where: {
            status: {
                in: [client_1.MissionStatus.PLANNED, client_1.MissionStatus.IN_PROGRESS],
            },
        },
        select: {
            id: true,
            title: true,
            location: true,
            startDate: true,
        },
        orderBy: {
            startDate: 'asc',
        },
    });
    return missions.map(m => ({ ...m, startDate: m.startDate.toISOString() }));
});
const getVolunteerInfoTool = (0, flow_1.tool)({
    name: 'getVolunteerRegistrationInfo',
    description: 'Get information about how to become a volunteer.',
}, async () => {
    return {
        registrationUrl: '/register',
        requirements: [
            "Être de nationalité gabonaise (ou résident).",
            "Avoir au moins 18 ans.",
            "Fournir une pièce d'identité valide.",
            "Accepter les 7 principes de la Croix-Rouge.",
        ]
    };
});
// Flows
const chatbotFlow = async (messages) => {
    const history = messages.map((msg) => ({
        role: msg.role,
        content: [{ text: msg.content }]
    }));
    const response = await googleai_1.gemini15Pro.generate({
        history: history,
        tools: [getMissionsTool, getVolunteerInfoTool],
        prompt: `
        You are a friendly and helpful virtual assistant for the Gabonese Red Cross, 6th district committee.
        Your goal is to answer user questions accurately and concisely.
        - If asked about available missions, use the getAvailableMissions tool to provide a summary.
        - If asked about how to become a volunteer, use the getVolunteerRegistrationInfo tool.
        - For all other questions, answer based on your general knowledge of the Red Cross.
        - Always respond in French.
        - Keep your answers brief and to the point.
      `,
        config: {
            temperature: 0.5,
        },
    });
    return response.text();
};
exports.chatbotFlow = chatbotFlow;
const missionAssignmentFlow = async (missionId) => {
    const mission = await prisma_1.default.mission.findUnique({
        where: { id: missionId },
    });
    if (!mission) {
        throw new Error("Mission not found");
    }
    const volunteers = await prisma_1.default.user.findMany({
        where: { role: 'VOLUNTEER' },
        include: { skills: true }
    });
    const prompt = `
        Mission: "${mission.title}"
        Description: ${mission.description}
        Compétences requises: ${mission.requiredSkills.join(', ')}

        Liste de volontaires disponibles:
        ${volunteers.map((v) => `
            - ID: ${v.id}, Nom: ${v.firstName} ${v.lastName}, Compétences: ${v.skills.map((s) => s.name).join(', ')}, Disponibilité: ${v.availability.join(', ')}
        `).join('')}

        En te basant sur les informations ci-dessus, recommande les 3 meilleurs volontaires pour cette mission.
        Analyse la correspondance entre les compétences requises pour la mission et les compétences des volontaires.
        Prends également en compte la disponibilité des volontaires si possible.
        Fournis une brève justification pour chaque recommandation.
        
        Réponds uniquement avec un objet JSON sous la forme:
        {
            "recommendations": [
                {
                    "volunteerId": "...",
                    "volunteerName": "...",
                    "justification": "...",
                    "matchScore": 0.9 
                }
            ]
        }
    `;
    const llmResponse = await googleai_1.gemini15Pro.generate({
        prompt,
        config: {
            temperature: 0.2,
        },
        output: {
            format: 'json',
        }
    });
    return llmResponse.output() || { recommendations: [] };
};
exports.missionAssignmentFlow = missionAssignmentFlow;
