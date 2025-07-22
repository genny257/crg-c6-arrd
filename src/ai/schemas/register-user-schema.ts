
import { z } from 'zod';

const LocationSchema = z.object({
  province: z.string().min(1, "La province est requise."),
  departement: z.string().min(1, "Le département est requis."),
  communeCanton: z.string().min(1, "La commune ou le canton est requis."),
  arrondissement: z.string().optional(),
  quartierVillage: z.string().min(1, "Le quartier ou le village est requis."),
});

export const RegisterUserInputSchema = z.object({
  // Step 1: Personal Information
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  birthDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', "La date de naissance est invalide."),
  birthPlace: z.string().min(2, "Le lieu de naissance est requis."),
  sex: z.enum(["masculin", "féminin"]),
  maritalStatus: z.enum(["célibataire", "marié(e)", "divorcé(e)", "veuf(ve)"]),
  idType: z.string().min(1, "Le type de pièce d'identité est requis."),
  idNumber: z.string().min(1, "Le numéro de la pièce est requis."),

  // Step 2: Contact & Residence
  phone: z.string().min(1, "Le numéro de téléphone est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  address: z.string().min(5, "L'adresse complète est requise."),
  residence: LocationSchema,

  // Step 3: Profile & Skills
  educationLevel: z.string().min(1, "Le niveau d'études est requis."),
  profession: z.string().min(1, "La profession est requise."),
  skills: z.array(z.string()).optional(),
  
  // Step 4: Engagement & Availability
  volunteerExperience: z.string().optional(),
  availability: z.array(z.string()).min(1, "Veuillez sélectionner au moins une disponibilité."),
  causes: z.array(z.string()).min(1, "Veuillez sélectionner au moins un domaine."),
  assignedCell: z.string().min(1, "Veuillez choisir une cellule d'affectation."),

  // Step 5: Attachments & Finalization
  photo: z.string().url("L'URL de la photo est invalide.").optional().or(z.literal('')),
  idCardFront: z.string().url("L'URL du recto de la CNI est invalide.").optional().or(z.literal('')),
  idCardBack: z.string().url("L'URL du verso de la CNI est invalide.").optional().or(z.literal('')),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les termes et conditions.",
  }),
});
