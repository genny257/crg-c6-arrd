// src/controllers/mission.controller.ts
import { Request, Response } from 'express';
import * as missionService from '../services/mission.service';
import * as aiService from '../services/ai.service';
import { z } from 'zod';
import { MissionStatus } from '@prisma/client';

// Base schema for mission data
const missionDataSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
  description: z.string().min(10, "La description est requise."),
  location: z.string().min(3, "Le lieu est requis."),
  startDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Date de début invalide",
  }),
  endDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Date de fin invalide",
  }),
  status: z.nativeEnum(MissionStatus).optional().default(MissionStatus.PLANNED),
  requiredSkills: z.array(z.string()).optional().default([]),
  maxParticipants: z.number().int().positive().optional().nullable(),
});

// Schema for creation and updates with date refinement
const missionSchema = missionDataSchema.refine(data => {
    if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
}, {
    message: "La date de fin ne peut pas être antérieure à la date de début.",
    path: ["endDate"],
});


/**
 * Récupère toutes les missions.
 */
export const getMissions = async (req: Request, res: Response) => {
  try {
    const missions = await missionService.getAllMissions();
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des missions.', error });
  }
};

/**
 * Récupère une mission par son ID.
 */
export const getMissionById = async (req: Request, res: Response) => {
  try {
    const mission = await missionService.getMissionById(req.params.id);
    if (mission) {
      res.status(200).json(mission);
    } else {
      res.status(404).json({ message: 'Mission non trouvée.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la mission.', error });
  }
};

/**
 * Crée une nouvelle mission.
 */
export const createMission = async (req: Request, res: Response) => {
  try {
    const validatedData = missionSchema.parse(req.body);
    const newMission = await missionService.createMission({
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      maxParticipants: validatedData.maxParticipants ?? null,
    });
    res.status(201).json(newMission);
  } catch (error) {
     if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation invalide', errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Erreur lors de la création de la mission.', error });
  }
};

/**
 * Met à jour une mission existante.
 */
export const updateMission = async (req: Request, res: Response) => {
  try {
    const validatedData = missionDataSchema.partial().parse(req.body);
    const updatedData = {
        ...validatedData,
        ...(validatedData.startDate && { startDate: new Date(validatedData.startDate) }),
        ...(validatedData.endDate && { endDate: new Date(validatedData.endDate) }),
    };

    const updatedMission = await missionService.updateMission(req.params.id, updatedData);
    res.status(200).json(updatedMission);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation invalide', errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la mission.', error });
  }
};

/**
 * Supprime une mission.
 */
export const deleteMission = async (req: Request, res: Response) => {
  try {
    await missionService.deleteMission(req.params.id);
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la mission.', error });
  }
};

/**
 * Suggests volunteers for a mission.
 */
export const suggestVolunteersForMission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const recommendations = await aiService.suggestVolunteers(id);
        res.status(200).json(recommendations);
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur lors de la suggestion des volontaires.', error: error.message });
    }
};

/**
 * Register a volunteer to a mission.
 */
const registerToMissionSchema = z.object({
    matricule: z.string().min(1, 'Le matricule est requis.'),
});
export const registerToMission = async (req: Request, res: Response) => {
    try {
        const { id: missionId } = req.params;
        const { matricule } = registerToMissionSchema.parse(req.body);

        // This doesn't need to be an AI flow, direct service call is better.
        const result = await missionService.registerVolunteerToMission(missionId, matricule);
        
        res.status(200).json(result);
    } catch (error: any) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, message: Object.values(error.flatten().fieldErrors).join(', ') });
        }
        res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription à la mission.', error: error.message });
    }
}
