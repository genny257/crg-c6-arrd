'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for the blog post generation
const BlogPostSchema = z.object({
  title: z.string().describe("Le titre de l'article, optimisé pour le SEO."),
  slug: z.string().describe("Le slug de l'URL, en minuscules, séparé par des tirets."),
  excerpt: z.string().describe("Un court résumé de l'article (environ 2-3 phrases)."),
  content: z.string().describe("Le contenu complet de l'article en Markdown, bien structuré avec des titres."),
});

type BlogPost = z.infer<typeof BlogPostSchema>;

// Define the Genkit flow for generating a blog post
const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: z.string(),
    outputSchema: BlogPostSchema,
  },
  async (topic) => {
    const geminiPro = ai.getModel('googleai/gemini-1.5-flash-latest');

    const response = await geminiPro.generate({
      prompt: `
        Sujet : "${topic}"

        Rédige un article de blog engageant et informatif sur ce sujet pour la Croix-Rouge Gabonaise.
        Le ton doit être professionnel, empathique et inspirant.
        Le contenu doit être structuré en format Markdown.
        Le slug doit être SEO-friendly.
        L'extrait doit donner envie de lire la suite.
      `,
      output: {
        schema: BlogPostSchema,
      },
      config: {
        temperature: 0.7,
      },
    });

    return response.output!;
  }
);

// Export a wrapper function to be used as a server action
export async function generateBlogPost(topic: string): Promise<BlogPost> {
  return await generateBlogPostFlow(topic);
}
