// src/services/ai.service.ts
import { ai } from '../../genkit.config';
import { MissionStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import type { GenerateOptions } from 'genkit/generate';

// Schemas
export const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

const BlogPostSchema = z.object({
  title: z.string().describe("The engaging title of the blog post."),
  slug: z.string().describe("The URL-friendly slug, based on the title (e.g., 'titre-de-l-article')."),
  excerpt: z.string().describe("A short, compelling summary of the article (1-2 sentences)."),
  content: z.string().describe("The full content of the article in Markdown format."),
});
export type BlogPost = z.infer<typeof BlogPostSchema>;

const VolunteerSuggestionSchema = z.object({
    recommendations: z.array(z.object({
        volunteerName: z.string().describe("The full name of the suggested volunteer."),
        justification: z.string().describe("A brief, one-sentence justification for why this volunteer is a good match."),
        matchScore: z.number().min(0).max(1).describe("A score from 0 to 1 indicating the quality of the match."),
    })).describe("A list of up to 3 recommended volunteers for the mission.")
});


// Tools
const getMissionsTool = ai.defineTool(
  {
    name: 'getAvailableMissions',
    description: 'Get a list of currently available missions that are planned or in progress.',
    inputSchema: z.void(),
    outputSchema: z.any(),
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

const getVolunteerInfoTool = ai.defineTool(
    {
        name: 'getVolunteerRegistrationInfo',
        description: 'Get information about how to become a volunteer.',
        inputSchema: z.void(),
        outputSchema: z.any(),
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
const chatbotFlow = ai.defineFlow(
    {
        name: 'chatbotFlow',
        inputSchema: z.array(MessageSchema),
        outputSchema: z.string(),
    },
    async (messages: Message[]) => {
        const history = messages.map((msg: Message) => ({
            role: msg.role,
            content: [{text: msg.content}]
        }));

        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-pro',
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
        } as GenerateOptions<any>);

        return llmResponse.text;
    }
);


const generateBlogPostFlow = ai.defineFlow(
    {
        name: 'generateBlogPostFlow',
        inputSchema: z.string(),
        outputSchema: BlogPostSchema,
    },
    async (topic) => {
        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-pro',
            prompt: `Rédige un article de blog engageant et informatif sur le sujet suivant : "${topic}". L'article doit être adapté pour l'organisation de la Croix-Rouge Gabonaise. Adopte un ton à la fois professionnel, humain et inspirant. L'article doit être structuré avec des titres et des paragraphes clairs, en utilisant le format Markdown.`,
            config: {
                temperature: 0.7,
            },
            output: {
                schema: BlogPostSchema,
            },
        });
        return llmResponse.output!;
    }
);

const missionAssignmentFlow = ai.defineFlow(
    {
        name: 'missionAssignmentFlow',
        inputSchema: z.string(),
        outputSchema: VolunteerSuggestionSchema,
    },
    async (missionId: string) => {
        const mission = await prisma.mission.findUnique({ where: { id: missionId } });
        if (!mission) throw new Error("Mission non trouvée.");

        const allVolunteers = await prisma.user.findMany({
            where: { role: 'VOLUNTEER', status: 'ACTIVE' },
            include: { skills: true }
        });

        const prompt = `
            Voici une mission de la Croix-Rouge:
            - Titre: ${mission.title}
            - Description: ${mission.description}
            - Compétences requises: ${mission.requiredSkills.join(', ') || 'Aucune'}

            Voici une liste de volontaires disponibles avec leurs compétences:
            ${allVolunteers.map(v => `- ${v.firstName} ${v.lastName}: ${v.skills.map(s => s.name).join(', ')}`).join('\n')}

            En te basant sur la description et les compétences requises, suggère les 3 meilleurs volontaires pour cette mission.
        `;

        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-pro',
            prompt,
            output: {
                schema: VolunteerSuggestionSchema,
            }
        });

        return llmResponse.output!;
    }
);


// Exported functions for controllers
export async function runChatbot(messages: Message[]): Promise<string> {
    return chatbotFlow(messages);
}

export async function generateBlogPost(topic: string): Promise<z.infer<typeof BlogPostSchema>> {
    return generateBlogPostFlow(topic);
}

export async function suggestVolunteers(missionId: string): Promise<z.infer<typeof VolunteerSuggestionSchema>> {
    return missionAssignmentFlow(missionId);
}
