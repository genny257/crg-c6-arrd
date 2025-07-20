
'use server';
/**
 * @fileOverview A user registration flow that saves data to Firestore.
 *
 * - registerUser - A function that handles user registration and saves to Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { RegisterUserInputSchema, type RegisterUserInput } from '@/ai/schemas/register-user-schema';
import { adminDb } from '@/lib/firebase/admin';

// Helper function to generate a unique matricule
const generateMatricule = async () => {
    if (!adminDb) {
        throw new Error("Firebase Admin is not initialized.");
    }
    const prefix = 'C6ARR';
    let isUnique = false;
    let newMatricule = '';

    while (!isUnique) {
        const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
        newMatricule = `${prefix}-${randomPart}`;

        const snapshot = await adminDb.collection('volunteers').where('matricule', '==', newMatricule).limit(1).get();
        if (snapshot.empty) {
            isUnique = true;
        }
    }
    return newMatricule;
};


const registerUserFlow = ai.defineFlow(
  {
    name: 'registerUserFlow',
    inputSchema: RegisterUserInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async (input) => {
    console.log('New user registration received:', JSON.stringify(input, null, 2));

    if (!adminDb) {
      const errorMessage = "Firebase Admin is not initialized. Cannot save to Firestore.";
      console.error(errorMessage);
      return { success: false, message: errorMessage };
    }

    try {
      const matricule = await generateMatricule();
      
      const volunteerRef = adminDb.collection('volunteers').doc();
      await volunteerRef.set({
        ...input,
        matricule,
        createdAt: new Date().toISOString(),
        status: 'En attente', // Set a default status
      });

      console.log(`User data saved to Firestore with ID: ${volunteerRef.id} and Matricule: ${matricule}`);

      return { success: true, message: 'User registered successfully and saved to database.' };
    } catch (error) {
        console.error("Error saving to Firestore:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Failed to save user to database: ${errorMessage}` };
    }
  }
);


export async function registerUser(input: RegisterUserInput): Promise<{ success: boolean; message: string }> {
    const validatedInput = RegisterUserInputSchema.parse(input);
    return await registerUserFlow(validatedInput);
}
