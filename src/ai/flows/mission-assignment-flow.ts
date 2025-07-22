// src/ai/flows/mission-assignment-flow.ts
import { defineFlow, run } from '@genkit-ai/flow';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const missionAssignmentFlow = defineFlow(
  {
    name: 'missionAssignmentFlow',
    inputSchema: z.object({ missionId: z.string() }),
    outputSchema: z.object({ recommendations: z.array(z.any()) }),
  },
  async ({ missionId }) => {
    
    const mission = await run('get-mission-details', async () => {
        return await prisma.mission.findUnique({
            where: { id: missionId },
        });
    });

    if (!mission) {
        throw new Error("Mission not found");
    }

    const volunteers = await run('get-all-volunteers', async () => {
        return await prisma.volunteer.findMany({
            include: { skills: true }
        });
    });

    const prompt = `
        Mission: "${mission.title}"
        Description: ${mission.description}
        Compétences requises: ${mission.requiredSkills.join(', ')}

        Liste de volontaires disponibles:
        ${volunteers.map(v => `
            - ID: ${v.id}, Nom: ${v.firstName} ${v.lastName}, Compétences: ${v.skills.map(s => s.name).join(', ')}, Disponibilité: ${v.availability.join(', ')}
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

    const llmResponse = await run('generate-recommendations', async () => 
        geminiPro.generate({
            prompt,
            config: {
                temperature: 0.2,
            },
            output: {
                format: 'json',
                schema: z.object({
                    recommendations: z.array(z.object({
                        volunteerId: z.string(),
                        volunteerName: z.string(),
                        justification: z.string(),
                        matchScore: z.number(),
                    }))
                })
            }
        })
    );
    
    return llmResponse.output() || { recommendations: [] };
  }
);
