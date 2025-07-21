
'use server';
/**
 * @fileOverview A flow to register a volunteer for a mission.
 *
 * - registerToMission - A function that handles the registration process.
 * - RegisterToMissionInput - The input type for the registerToMission function.
 * - RegisterToMissionOutput - The return type for the registerToMission function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import type { Mission } from '@/types/mission';
import type { Volunteer } from '@/types/volunteer';


const RegisterToMissionInputSchema = z.object({
  missionId: z.string().describe('The ID of the mission.'),
  matricule: z.string().describe('The matricule of the volunteer.'),
});
export type RegisterToMissionInput = z.infer<typeof RegisterToMissionInputSchema>;

const RegisterToMissionOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type RegisterToMissionOutput = z.infer<typeof RegisterToMissionOutputSchema>;


const registerToMissionFlow = ai.defineFlow(
  {
    name: 'registerToMissionFlow',
    inputSchema: RegisterToMissionInputSchema,
    outputSchema: RegisterToMissionOutputSchema,
  },
  async (input) => {
    if (!adminDb) {
        return { success: false, message: "La connexion à la base de données a échoué." };
    }

    try {
        const missionRef = adminDb.collection('missions').doc(input.missionId);
        const missionDoc = await missionRef.get();

        if (!missionDoc.exists) {
            return { success: false, message: "Mission non trouvée." };
        }
        const mission = missionDoc.data() as Mission;

        if (mission.status !== 'Planifiée' && mission.status !== 'En cours') {
            return { success: false, message: "Les inscriptions pour cette mission sont closes." };
        }

        const volunteerQuery = adminDb.collection('volunteers').where('matricule', '==', input.matricule).limit(1);
        const volunteerSnapshot = await volunteerQuery.get();
        if (volunteerSnapshot.empty) {
            return { success: false, message: "Aucun volontaire trouvé avec ce matricule." };
        }
        const volunteerDoc = volunteerSnapshot.docs[0];
        const volunteer = volunteerDoc.data() as Volunteer;

        if (volunteer.status !== 'Actif') {
            return { success: false, message: "Seuls les volontaires actifs peuvent s'inscrire." };
        }

        const currentParticipants = mission.participants || [];

        if (currentParticipants.includes(volunteerDoc.id)) {
            return { success: false, message: "Vous êtes déjà inscrit à cette mission." };
        }

        if (mission.maxParticipants && currentParticipants.length >= mission.maxParticipants) {
            return { success: false, message: "Cette mission a déjà atteint son nombre maximum de participants." };
        }

        const updatedParticipants = [...currentParticipants, volunteerDoc.id];
        await missionRef.update({ participants: updatedParticipants });

        return { success: true, message: `Inscription réussie ! Merci, ${volunteer.firstName}, pour votre engagement.` };

    } catch (error) {
        console.error("Error registering to mission:", error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
        return { success: false, message: `L'inscription a échoué: ${errorMessage}` };
    }
  }
);


export async function registerToMission(input: RegisterToMissionInput): Promise<RegisterToMissionOutput> {
    const validatedInput = RegisterToMissionInputSchema.parse(input);
    return await registerToMissionFlow(validatedInput);
}
