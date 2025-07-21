// src/controllers/mission.controller.ts
import { Request, Response } from 'express';
import * as missionService from '../services/mission.service';

/**
 * Gère la requête pour obtenir toutes les missions.
 * Appelle le service de mission et renvoie les missions trouvées
 * ou un message d'erreur en cas de problème.
 * @param req - L'objet de requête Express.
 * @param res - L'objet de réponse Express.
 */
export const getMissions = async (req: Request, res: Response) => {
  try {
    const missions = await missionService.getAllMissions();
    res.status(200).json(missions);
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse 500 avec un message
    res.status(500).json({ message: 'Error fetching missions', error });
  }
};