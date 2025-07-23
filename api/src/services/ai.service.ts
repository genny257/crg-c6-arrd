
// src/services/ai.service.ts
import { gemini15Pro, googleAI } from '@genkit-ai/googleai';
import { MissionStatus, User, Skill, Post } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { generate, tool } from 'genkit';
import { defineFlow, configureGenkit } from 'genkit';
import { genkit } from 'genkit/tool';

// Configure Genkit
configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

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
export const chatbotFlow = defineFlow(
    {
        name: 'chatbotFlow',
        inputSchema: z.array(MessageSchema),
        outputSchema: z.string(),
    },
    async (messages) => {
        const history = messages.map((msg: Message) => ({
            role: msg.role,
            content: [{text: msg.content}]
        }));

        const llmResponse = await generate({
            model: gemini15Pro,
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

        return llmResponse.text();
    }
);

interface VolunteerWithSkills extends User {
    skills: Skill[];
}

export const missionAssignmentFlow = defineFlow({
    name: 'missionAssignmentFlow',
    inputSchema: z.string(),
    outputSchema: z.any(),
}, async (missionId) => {
    
    const mission = await prisma.mission.findUnique({
        where: { id: missionId },
    });

    if (!mission) {
        throw new Error("Mission not found");
    }

    const volunteers = await prisma.user.findMany({
        where: { role: 'VOLUNTEER', status: 'ACTIVE' },
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

    const llmResponse = await generate({
            model: gemini15Pro,
            prompt,
            config: {
                temperature: 0.2,
                responseMimeType: 'application/json'
            }
        });
    
    const output = llmResponse.output();
    if (typeof output === 'string') {
        return JSON.parse(output);
    }
    return output || { recommendations: [] };
});

const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const blogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  imageHint: z.string(),
});

export const generateBlogPostFlow = defineFlow({
    name: "generateBlogPostFlow",
    inputSchema: z.string(),
    outputSchema: blogPostSchema,
}, async (topic) => {
    const prompt = `
        Génère un article de blog optimiste et engageant pour la Croix-Rouge Gabonaise sur le sujet suivant : "${topic}".
        L'article doit être structuré avec une introduction, quelques paragraphes de développement et une conclusion.
        Le ton doit être informatif, humain et inspirant.
        Utilise la syntaxe Markdown pour la mise en forme.

        Fournis la réponse sous forme d'objet JSON avec les clés suivantes :
        - "title": Un titre accrocheur pour l'article.
        - "slug": une version "slug" du titre (minuscules, tirets, pas d'accents).
        - "excerpt": Un résumé court et percutant de 2 ou 3 phrases.
        - "content": Le contenu complet de l'article en Markdown.
        - "imageHint": Deux mots-clés en anglais pour trouver une image d'illustration (ex: "volunteer help").
    `;

    const llmResponse = await generate({
        model: gemini15Pro,
        prompt: prompt,
        config: {
            temperature: 0.7,
            responseMimeType: 'application/json'
        },
    });

    const output = llmResponse.output();
    let blogPost;

    if (typeof output === 'string') {
        blogPost = JSON.parse(output);
    } else {
        blogPost = output;
    }
    
    // Ensure slug is correctly formatted
    blogPost.slug = slugify(blogPost.title);

    return blogPost;
});
