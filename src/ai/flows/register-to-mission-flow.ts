'use server';

import { ai } from '@/ai/genkit';
import prisma from '@/lib/prisma';
import {
  RegisterToMissionInputSchema,
  RegisterToMissionOutputSchema,
  type RegisterToMissionInput,
  type RegisterToMissionOutput,
} from '@/ai/schemas/register-to-mission-schema';

export async function registerToMission(
  input: RegisterToMissionInput
): Promise<RegisterToMissionOutput> {
  return registerToMissionFlow(input);
}

const registerToMissionFlow = ai.defineFlow(
  {
    name: 'registerToMissionFlow',
    inputSchema: RegisterToMissionInputSchema,
    outputSchema: RegisterToMissionOutputSchema,
  },
  async ({ missionId, matricule }) => {
    // 1. Check if volunteer exists and is active
    const volunteer = await prisma.volunteer.findUnique({
      where: { matricule },
      include: { missions: true },
    });

    if (!volunteer) {
      return {
        success: false,
        message:
          "Matricule non trouvé. Veuillez vérifier votre matricule et réessayer.",
      };
    }
    if (volunteer.status !== 'Actif') {
      return {
        success: false,
        message: `Votre statut de volontaire est "${volunteer.status}". Vous ne pouvez pas vous inscrire aux missions.`,
      };
    }

    // 2. Check if mission exists
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { participants: true },
    });

    if (!mission) {
      return {
        success: false,
        message: 'Mission non trouvée. Impossible de vous inscrire.',
      };
    }

    // 3. Check if mission is full
    if (
      mission.maxParticipants &&
      mission.participants.length >= mission.maxParticipants
    ) {
      return {
        success: false,
        message: 'Cette mission est complète. Vous ne pouvez plus vous inscrire.',
      };
    }

    // 4. Check if volunteer is already registered
    const isAlreadyRegistered = mission.participants.some(
      (p) => p.id === volunteer.id
    );
    if (isAlreadyRegistered) {
      return {
        success: false,
        message: 'Vous êtes déjà inscrit(e) à cette mission.',
      };
    }

    // 5. Register volunteer to the mission
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
      message:
        'Félicitations ! Votre inscription à la mission a été confirmée.',
    };
  }
);
