// api/genkit.config.js
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
});
