
import { z } from 'zod';

export const RegisterToMissionInputSchema = z.object({
  missionId: z.string().describe('The ID of the mission.'),
  matricule: z
    .string()
    .min(1, 'Le matricule est requis.')
    .describe('The matricule of the volunteer.'),
});
export type RegisterToMissionInput = z.infer<
  typeof RegisterToMissionInputSchema
>;

export const RegisterToMissionOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type RegisterToMissionOutput = z.infer<
  typeof RegisterToMissionOutputSchema
>;
