"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSponsorships = exports.createSponsorship = void 0;
const sponsorshipService = __importStar(require("../services/sponsorship.service"));
const zod_1 = require("zod");
const sponsorshipSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1, "Le nom de l'entreprise est requis"),
    contactName: zod_1.z.string().min(1, "Le nom du contact est requis"),
    email: zod_1.z.string().email("L'adresse e-mail est invalide"),
    phone: zod_1.z.string().optional(),
    message: zod_1.z.string().min(1, "Le message ne peut pas être vide"),
});
const createSponsorship = async (req, res) => {
    try {
        const validatedData = sponsorshipSchema.parse(req.body);
        const dataForService = {
            ...validatedData,
            phone: validatedData.phone || null,
        };
        const sponsorship = await sponsorshipService.createSponsorship(dataForService);
        res.status(201).json(sponsorship);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation invalide', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Erreur lors de la création de la demande de mécénat', error });
    }
};
exports.createSponsorship = createSponsorship;
const getSponsorships = async (req, res) => {
    try {
        const sponsorships = await sponsorshipService.getAllSponsorships();
        res.status(200).json(sponsorships);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes de mécénat', error });
    }
};
exports.getSponsorships = getSponsorships;
