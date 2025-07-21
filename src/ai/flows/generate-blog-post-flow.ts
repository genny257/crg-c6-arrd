'use server';
/**
 * @fileOverview A flow to generate a blog post from a topic.
 *
 * - generateBlogPost - A function that generates a blog post structure.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic or subject of the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A catchy and informative title for the blog post.'),
  slug: z.string().describe('A URL-friendly slug based on the title (e.g., "titre-de-l-article").'),
  excerpt: z.string().describe('A short, engaging summary of the article, around 2-3 sentences.'),
  content: z.string().describe('The full content of the blog post in Markdown format. It should be well-structured with headings, paragraphs, and lists.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `Vous êtes un expert en communication pour la Croix-Rouge Gabonaise, comité du 6ème arrondissement.
  Votre tâche est de rédiger un article de blog complet et bien structuré sur le sujet suivant : {{{topic}}}.

  Le ton doit être institutionnel, informatif et engageant.
  L'objectif est d'informer le public sur les activités de la Croix-Rouge, de susciter l'engagement (dons, volontariat) et de véhiculer une image de confiance et de professionnalisme.

  Veuillez générer les éléments suivants :
  1.  **title** : Un titre percutant et clair.
  2.  **slug** : Un slug pour l'URL, en minuscules, avec des tirets à la place des espaces.
  3.  **excerpt** : Un résumé concis de 2 à 3 phrases pour l'aperçu sur la page du blog.
  4.  **content** : Le contenu intégral de l'article en format Markdown. L'article doit faire au moins 4 paragraphes et inclure des titres (##) et des listes à puces (*) si pertinent.

  Assurez-vous que le contenu est pertinent pour le contexte de la Croix-Rouge au Gabon.
  `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateBlogPost(topic: string): Promise<GenerateBlogPostOutput> {
  const result = await generateBlogPostFlow({topic});
  return result;
}
