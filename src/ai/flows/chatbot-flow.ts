
'use server';
/**
 * @fileOverview Chatbot flow for the Red Cross platform.
 * This file defines the Genkit flow for the chatbot, including tools to
 * fetch real-time data about missions and volunteering, enabling the AI
 * to provide accurate and helpful responses to users.
 */
import { ai } from '@/ai/genkit';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import type { Message } from '@/ai/schemas/chatbot-schema';
import { MessageSchema } from '@/ai/schemas/chatbot-schema';

// --- Genkit Tools ---

const getMissionsTool = ai.defineTool(
  {
    name: 'getAvailableMissions',
    description: 'Get a list of currently available missions that are planned or in progress.',
    outputSchema: z.array(z.object({
        id: z.string(),
        title: z.string(),
        location: z.string(),
        startDate: z.string(),
    })),
  },
  async () => {
    const missions = await prisma.mission.findMany({
      where: {
        status: {
          in: ['Planifiée', 'En_cours'],
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
        outputSchema: z.object({
            registrationUrl: z.string(),
            requirements: z.array(z.string()),
        })
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


// --- Main Chatbot Flow ---

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.object({
      messages: z.array(MessageSchema),
    }),
    outputSchema: z.string(),
  },
  async ({ messages }) => {
    
    const model = ai.getModel('googleai/gemini-1.5-flash-latest');

    const history = messages.map(msg => ({
        role: msg.role,
        content: [{text: msg.content}]
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

    return response.text;
  }
);


export async function chat(messages: Message[], input: string): Promise<string> {
    const allMessages = [...messages, { role: 'user', content: input }];
    const response = await chatbotFlow({ messages: allMessages });
    return response;
}
