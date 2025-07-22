"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserInputSchema = void 0;
const zod_1 = require("zod");
const LocationSchema = zod_1.z.object({
    province: zod_1.z.string().min(1, "La province est requise."),
    departement: zod_1.z.string().min(1, "Le département est requis."),
    communeCanton: zod_1.z.string().min(1, "La commune ou le canton est requis."),
    arrondissement: zod_1.z.string().optional(),
    quartierVillage: zod_1.z.string().min(1, "Le quartier ou le village est requis."),
});
exports.RegisterUserInputSchema = zod_1.z.object({
    // Step 1: Personal Information
    firstName: zod_1.z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
    lastName: zod_1.z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    nationality: zod_1.z.string().min(1, "La nationalité est requise."),
    birthDate: zod_1.z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', "La date de naissance est invalide."),
    birthPlace: zod_1.z.string().min(2, "Le lieu de naissance est requis."),
    sex: zod_1.z.enum(["masculin", "féminin"]),
    maritalStatus: zod_1.z.enum(["célibataire", "marié(e)", "divorcé(e)", "veuf(ve)"]),
    idType: zod_1.z.string().min(1, "Le type de pièce d'identité est requis."),
    idNumber: zod_1.z.string().min(1, "Le numéro de la pièce est requis."),
    // Step 2: Contact & Residence
    phone: zod_1.z.string().min(1, "Le numéro de téléphone est requis."),
    email: zod_1.z.string().email("L'adresse e-mail est invalide."),
    password: zod_1.z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: zod_1.z.string().min(8, "La confirmation est requise."),
    address: zod_1.z.string().min(5, "L'adresse complète est requise."),
    residence: LocationSchema,
    // Step 3: Profile & Skills
    educationLevel: zod_1.z.string().min(1, "Le niveau d'études est requis."),
    profession: zod_1.z.string().min(1, "La profession est requise."),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    // Step 4: Engagement & Availability
    volunteerExperience: zod_1.z.string().optional(),
    availability: zod_1.z.array(zod_1.z.string()).min(1, "Veuillez sélectionner au moins une disponibilité."),
    causes: zod_1.z.array(zod_1.z.string()).min(1, "Veuillez sélectionner au moins un domaine."),
    assignedCell: zod_1.z.string().min(1, "Veuillez choisir une cellule d'affectation."),
    // Step 5: Attachments & Finalization
    photo: zod_1.z.string().url("L'URL de la photo est invalide.").optional().or(zod_1.z.literal('')),
    idCardFront: zod_1.z.string().url("L'URL du recto de la CNI est invalide.").optional().or(zod_1.z.literal('')),
    idCardBack: zod_1.z.string().url("L'URL du verso de la CNI est invalide.").optional().or(zod_1.z.literal('')),
    termsAccepted: zod_1.z.boolean().refine((val) => val === true, {
        message: "Vous devez accepter les termes et conditions.",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"], // path of error
});
