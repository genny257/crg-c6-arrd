"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionAssignmentFlow = void 0;
// src/ai/flows/mission-assignment-flow.ts
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.missionAssignmentFlow = (0, flow_1.defineFlow)({
    name: 'missionAssignmentFlow',
    inputSchema: zod_1.z.object({ missionId: zod_1.z.string() }),
    outputSchema: zod_1.z.object({ recommendations: zod_1.z.array(zod_1.z.any()) }),
}, async ({ missionId }) => {
    const mission = await (0, flow_1.run)('get-mission-details', async () => {
        return await prisma.mission.findUnique({
            where: { id: missionId },
        });
    });
    if (!mission) {
        throw new Error("Mission not found");
    }
    const volunteers = await (0, flow_1.run)('get-all-volunteers', async () => {
        return await prisma.user.findMany({
            where: { role: 'VOLUNTEER' },
            include: { skills: true }
        });
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
    const llmResponse = await (0, flow_1.run)('generate-recommendations', async () => googleai_1.gemini15Pro.generate({
        prompt,
        config: {
            temperature: 0.2,
        },
        output: {
            format: 'json',
            schema: zod_1.z.object({
                recommendations: zod_1.z.array(zod_1.z.object({
                    volunteerId: zod_1.z.string(),
                    volunteerName: zod_1.z.string(),
                    justification: zod_1.z.string(),
                    matchScore: zod_1.z.number(),
                }))
            })
        }
    }));
    return llmResponse.output() || { recommendations: [] };
});
