
'use server';
/**
 * @fileOverview Flow to handle volunteer registration for a mission.
 *
 * - registerToMission - Handles the business logic for registering a volunteer.
 */
import { ai } from '@/ai/genkit';
import prisma from '@/lib/prisma';
import type { RegisterToMissionInput, RegisterToMissionOutput } from '@/ai/schemas/register-to-mission-schema';
import { RegisterToMissionInputSchema, RegisterToMissionOutputSchema } from '@/ai/schemas/register-to-mission-schema';


// Exported wrapper function that calls the flow.
export async function registerToMission(
  input: RegisterToMissionInput
): Promise<RegisterToMissionOutput> {
  return registerToMissionFlow(input);
}

// Genkit flow definition
const registerToMissionFlow = ai.defineFlow(
  {
    name: 'registerToMissionFlow',
    inputSchema: RegisterToMissionInputSchema,
    outputSchema: RegisterToMissionOutputSchema,
  },
  async ({ missionId, matricule }) => {
    // 1. Find the volunteer by matricule
    const volunteer = await prisma.volunteer.findUnique({
      where: { matricule },
    });

    if (!volunteer) {
      return {
        success: false,
        message: `Aucun volontaire trouvé avec le matricule ${matricule}. Veuillez vérifier et réessayer.`,
      };
    }

    // 2. Check volunteer's status
    if (volunteer.status !== 'Actif') {
      return {
        success: false,
        message: `Votre statut de volontaire (${volunteer.status}) ne vous permet pas de vous inscrire. Veuillez contacter un administrateur.`,
      };
    }

    // 3. Find the mission
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        participants: true,
      },
    });

    if (!mission) {
      return { success: false, message: 'Mission non trouvée.' };
    }

    // 4. Check if mission is full
    if (
      mission.maxParticipants &&
      mission.participants.length >= mission.maxParticipants
    ) {
      return {
        success: false,
        message: 'Cette mission est complète. Il n’y a plus de places disponibles.',
      };
    }

    // 5. Check if volunteer is already registered
    const isAlreadyRegistered = mission.participants.some(
      (p) => p.id === volunteer.id
    );

    if (isAlreadyRegistered) {
      return {
        success: false,
        message: 'Vous êtes déjà inscrit à cette mission.',
      };
    }

    // 6. Register the volunteer
    await prisma.mission.update({
      where: { id: missionId },
      data: {
        participants: {
          connect: { id: volunteer.id },
        },
      },
    });

    return {
      success: true,
      message: `Félicitations, ${volunteer.firstName} ! Votre inscription à la mission "${mission.title}" a été confirmée.`,
    };
  }
);
