// src/services/mission.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Récupère toutes les missions de la base de données, en incluant les participants (volontaires) associés.
 * @returns Une promesse qui se résout en un tableau de toutes les missions.
 */
export const getAllMissions = async () => {
  // TODO: Remplacer les données statiques par un appel Prisma
  // Exemple:
  // return await prisma.mission.findMany({
  //   include: {
  //     participants: true,
  //   },
  // });

  // Données statiques pour le développement en attendant l'implémentation de la BDD
  return [
    {
      id: "mission-1",
      title: "Distribution de kits alimentaires à Nzeng-Ayong",
      description: "Aide à la distribution de colis alimentaires pour les familles dans le besoin.",
      location: "Nzeng-Ayong, Libreville",
      startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
      status: 'Planifiée',
      requiredSkills: ["Logistique", "Communication"],
      participants: [],
      maxParticipants: 20
    },
     {
      id: "mission-2",
      title: "Formation aux premiers secours au Lycée Djoué Dabany",
      description: "Session de formation aux gestes qui sauvent pour les lycéens.",
      location: "Lycée Djoué Dabany",
      startDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      status: 'Planifiée',
      requiredSkills: ["Secourisme", "Animation"],
      participants: [],
      maxParticipants: 30
    },
     {
      id: "mission-3",
      title: "Opération de nettoyage de la plage de Bikélé",
      description: "Collecte de déchets et sensibilisation à la protection de l'environnement.",
      location: "Plage de Bikélé",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: 'En cours',
      requiredSkills: [],
      participants: [],
      maxParticipants: 50
    },
     {
      id: "mission-4",
      title: "Campagne de don du sang",
      description: "Organisation d'une collecte de sang au siège du comité.",
      location: "Siège du Comité",
      startDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      status: 'Terminée',
      requiredSkills: ["Infirmier(e)", "Aide-soignant(e)"],
      participants: [],
    }
  ];
};
