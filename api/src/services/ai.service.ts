// src/services/ai.service.ts
import { startFlow, tool } from '@genkit-ai/flow';
import { gemini15Pro, googleAI } from '@genkit-ai/googleai';
import { PrismaClient, MissionStatus, User, Skill } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';

// Schemas
const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

type Message = z.infer<typeof MessageSchema>;

// Tools
const getMissionsTool = tool(
  {
    name: 'getAvailableMissions',
    description: 'Get a list of currently available missions that are planned or in progress.',
  },
  async () => {
    const missions = await prisma.mission.findMany({
      where: {
        status: {
          in: [MissionStatus.PLANNED, MissionStatus.IN_PROGRESS],
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
    return missions.map(m => ({...m, startDate: m.startDate.toISOString()}));
  }
);

const getVolunteerInfoTool = tool(
    {
        name: 'getVolunteerRegistrationInfo',
        description: 'Get information about how to become a volunteer.',
    },
    async () => {
        return {
            registrationUrl: '/register',
            requirements: [
                "Être de nationalité gabonaise (ou résident).",
                "Avoir au moins 18 ans.",
                "Fournir une pièce d'identité valide.",
                "Accepter les 7 principes de la Croix-Rouge.",
            ]
        }
    }
);

// Flows
export const chatbotFlow = async (messages: Message[]) => {
    
    const history = messages.map((msg: Message) => ({
        role: msg.role,
        content: [{text: msg.content}]
    }));

    const response = await gemini15Pro.generate({
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
  }
;

interface VolunteerWithSkills extends User {
    skills: Skill[];
}

export const missionAssignmentFlow = async (missionId: string) => {
    
    const mission = await prisma.mission.findUnique({
        where: { id: missionId },
    });

    if (!mission) {
        throw new Error("Mission not found");
    }

    const volunteers = await prisma.user.findMany({
        where: { role: 'VOLUNTEER' },
        include: { skills: true }
    }) as VolunteerWithSkills[];

    const prompt = `
        Mission: "${mission.title}"
        Description: ${mission.description}
        Compétences requises: ${mission.requiredSkills.join(', ')}

        Liste de volontaires disponibles:
        ${volunteers.map((v: VolunteerWithSkills) => `
            - ID: ${v.id}, Nom: ${v.firstName} ${v.lastName}, Compétences: ${v.skills.map((s: Skill) => s.name).join(', ')}, Disponibilité: ${v.availability.join(', ')}
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

    const llmResponse = await gemini15Pro.generate({
            prompt,
            config: {
                temperature: 0.2,
            },
            output: {
                format: 'json',
            }
        })
    
    return llmResponse.output() || { recommendations: [] };
  }
;