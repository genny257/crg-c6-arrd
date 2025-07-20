
/**
 * @fileOverview Zod schema for user registration.
 *
 * - RegisterUserInputSchema - The Zod schema for the registerUser function input.
 * - RegisterUserInput - The TypeScript type inferred from the schema.
 */

import { z } from 'zod';

const LocationSchema = z.object({
  province: z.string().optional(),
  departement: z.string().optional(),
  communeCanton: z.string().optional(),
  arrondissement: z.string().optional(),
  quartierVillage: z.string().optional(),
});

export const RegisterUserInputSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom est requis."),
  birthDate: z.string().min(1, "La date de naissance est requise."),
  phone: z.string().min(1, "Le numéro de téléphone est requis."),
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  address: z.string().min(1, "L'adresse est requise."),
  educationLevel: z.string().optional(),
  profession: z.string().optional(),
  skills: z.array(z.string()).optional(),
  volunteerExperience: z.string().optional(),
  availability: z.array(z.string()).optional(),
  causes: z.array(z.string()).optional(),
  motivation: z.string().optional(),
  assignedCell: z.string().optional(),
  residence: LocationSchema,
  interventionZone: LocationSchema,
  idCardFront: z.string().optional().describe("A data URI of the front of the ID card."),
  idCardBack: z.string().optional().describe("A data URI of the back of the ID card."),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les termes et conditions." }),
  }),
});

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;
