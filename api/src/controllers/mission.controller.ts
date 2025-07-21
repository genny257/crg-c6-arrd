// src/controllers/mission.controller.ts
import { Request, Response } from 'express';
import * as missionService from '../services/mission.service';

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
    const newMission = await missionService.createMission(req.body);
    res.status(201).json(newMission);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la mission.', error });
  }
};

/**
 * Met à jour une mission existante.
 */
export const updateMission = async (req: Request, res: Response) => {
  try {
    const updatedMission = await missionService.updateMission(req.params.id, req.body);
    res.status(200).json(updatedMission);
  } catch (error) {
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