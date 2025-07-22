"use strict";
'use server';
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureGenkit = configureGenkit;
exports.chat = chat;
/**
 * @fileOverview Chatbot flow for the Red Cross platform.
 * This file defines the Genkit flow for the chatbot, including tools to
 * fetch real-time data about missions and volunteering, enabling the AI
 * to provide accurate and helpful responses to users.
 */
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const chatbot_schema_1 = require("../schemas/chatbot-schema");
const prisma = new client_1.PrismaClient();
function configureGenkit() {
    (0, flow_1.configure)({
        plugins: [
            (0, googleai_1.googleAI)(),
        ],
        logLevel: 'debug',
        enableTracingAndMetrics: true,
    });
}
// --- Genkit Tools ---
const getMissionsTool = (0, flow_1.defineTool)({
    name: 'getAvailableMissions',
    description: 'Get a list of currently available missions that are planned or in progress.',
    outputSchema: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        title: zod_1.z.string(),
        location: zod_1.z.string(),
        startDate: zod_1.z.string(),
    })),
}, async () => {
    const missions = await prisma.mission.findMany({
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
const getVolunteerInfoTool = (0, flow_1.defineTool)({
    name: 'getVolunteerRegistrationInfo',
    description: 'Get information about how to become a volunteer.',
    outputSchema: zod_1.z.object({
        registrationUrl: zod_1.z.string(),
        requirements: zod_1.z.array(zod_1.z.string()),
    })
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
// --- Main Chatbot Flow ---
const chatbotFlow = (0, flow_1.defineFlow)({
    name: 'chatbotFlow',
    inputSchema: zod_1.z.object({
        messages: zod_1.z.array(chatbot_schema_1.MessageSchema),
    }),
    outputSchema: zod_1.z.string(),
}, async ({ messages }) => {
    const model = (0, flow_1.getModel)('googleai/gemini-1.5-flash-latest');
    const history = messages.map((msg) => ({
        role: msg.role,
        content: [{ text: msg.content }]
    }));
    const response = await model.generate({
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
});
async function chat(messages, input) {
    const allMessages = [...messages, { role: 'user', content: input }];
    const response = await chatbotFlow({ messages: allMessages });
    return response;
}
