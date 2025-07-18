
'use server';
/**
 * @fileOverview A user registration flow.
 *
 * - registerUser - A function that handles user registration.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { RegisterUserInputSchema, type RegisterUserInput } from '@/ai/schemas/register-user-schema';

const registerUserFlow = ai.defineFlow(
  {
    name: 'registerUserFlow',
    inputSchema: RegisterUserInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async (input) => {
    console.log('New user registration received:', JSON.stringify(input, null, 2));

    // Here you would typically save the user data to a database.
    // For now, we just simulate a successful registration.

    return { success: true, message: 'User registered successfully.' };
  }
);


export async function registerUser(input: RegisterUserInput): Promise<{ success: boolean; message: string }> {
    const validatedInput = RegisterUserInputSchema.parse(input);
    return await registerUserFlow(validatedInput);
}

