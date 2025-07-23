// src/services/team.service.ts
import { TeamStructure } from '@/types/team';

// In a real application, this data would come from a database.
// For this example, we'll keep it as a static object.
const teamStructureData: TeamStructure = {
    president: { name: "Jean-Pierre Nkoume", role: "Président du Comité", avatar: "https://placehold.co/100x100.png", hint: "male portrait" },
    vicePresident: { name: "Aïcha Bongo", role: "Vice-Présidente", avatar: "https://placehold.co/100x100.png", hint: "female portrait" },
    focalPoints: [
        { name: "Marc Ona Essang", role: "Point Focal 1", avatar: "https://placehold.co/100x100.png", hint: "male portrait" },
        { name: "Juliette Bivigou", role: "Point Focal 2", avatar: "https://placehold.co/100x100.png", hint: "female portrait" },
    ],
    coordinators: [
        { name: "Paul Abessolo", role: "Nzeng-Ayong Lac", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
        { name: "Sophie Mavoungou", role: "Nzeng-Ayong Village", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
        { name: "Chantal Lendoye", role: "Ondogo", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
        { name: "Gaston Bouanga", role: "PK6-PK9", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
        { name: "Alice Kengue", role: "PK9-Bikélé", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    ],
    operationalPools: [
        { name: "Santé", mission: "Promotion de la santé communautaire.", coordinators: [{ name: "Dr. Moussa Traoré", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Eliane Mba", role: "Coordinatrice Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], iconKey: "HeartPulse" },
        { name: "Jeunesse et Volontariat", mission: "Mobilisation des jeunes et des volontaires.", coordinators: [{ name: "Kevin Essono", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Sarah Nguema", role: "Coordinatrice Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], iconKey: "Users" },
        { name: "Étude de Projet", mission: "Conception et évaluation des projets.", coordinators: [{ name: "Carine Ibinga", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}, { name: "Luc Boussougou", role: "Coordinateur Adjoint", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], iconKey: "ClipboardCheck" },
        { name: "Secours", mission: "Interventions d'urgence.", coordinators: [{ name: "Gérard Lema", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Awa Diop", role: "Coordinatrice Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], iconKey: "Siren" },
        { name: "Action Sociale", mission: "Soutien aux populations vulnérables.", coordinators: [{ name: "Estelle Koumba", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}, { name: "Pierre Eyeghe", role: "Coordinateur Adjoint", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], iconKey: "HandHeart" },
        { name: "Assainissement et Hygiène", mission: "Promotion de l'hygiène.", coordinators: [{ name: "Thierry Ndong", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Grace Ongone", role: "Coordinatrice Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], iconKey: "Soup" },
    ],
    supportPools: [
        { name: "Secrétariat", mission: "Gestion administrative et coordination.", coordinators: [{ name: "Yves Moukagni", role: "Secrétaire Général", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Nadège Mboumba", role: "Secrétaire Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait" }], iconKey: "Archive" },
        { name: "Trésorerie", mission: "Gestion financière.", coordinators: [{ name: "Martin Okouyi", role: "Trésorier Général", avatar: "https://placehold.co/80x80.png", hint: "male portrait" }, { name: "Fatima Diallo", role: "Trésorière Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait" }], iconKey: "Banknote" },
        { name: "Logistique", mission: "Gestion du matériel et des ressources.", coordinators: [{ name: "Christian N'Goma", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Valérie Asseko", role: "Coordinatrice Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], iconKey: "Truck" },
        { name: "Discipline", mission: "Renforcement de l'organisation interne.", coordinators: [{ name: "Serge Moussavou", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Sandrine Obiang", role: "Coordinatrice Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], iconKey: "Shield" },
        { name: "Formation", mission: "Développement des compétences.", coordinators: [{ name: "Nathalie Ngouma", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}, { name: "Hervé Boumah", role: "Coordinateur Adjoint", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], iconKey: "GraduationCap" },
    ]
};

export const getTeamStructure = async (): Promise<TeamStructure> => {
    // In the future, you could fetch this from a database or a configuration file.
    return teamStructureData;
};
