'use server';
/**
 * @fileOverview A chatbot flow for the Croix-Rouge Gabonaise.
 *
 * - chat - A function that handles chatbot conversations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {
    schema: z.object({
      history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })),
      question: z.string(),
    }),
  },
  prompt: `Vous êtes un assistant virtuel de la Croix-Rouge Gabonaise, comité du 6ème arrondissement de Libreville.
  Votre ton doit être institutionnel, rassurant et informatif.
  Votre mission est de répondre aux questions des visiteurs sur l'organisation, ses missions, comment devenir volontaire, et comment faire un don.
  Ne répondez pas aux questions qui ne concernent pas la Croix-Rouge Gabonaise. Soyez concis et clair.

  Voici l'historique de la conversation :
  {{#each history}}
    {{#if (eq role 'user')}}De: Utilisateur{{else}}De: Assistant{{/if}}
    {{content}}
  {{/each}}

  Nouvelle question de l'utilisateur : {{{question}}}`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.object({
      history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })),
      question: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await prompt(input);
    return llmResponse.text;
  }
);

export async function chat(history: any[], question: string): Promise<string> {
  const result = await chatbotFlow({history, question});
  return result;
}
