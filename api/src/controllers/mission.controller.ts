// src/controllers/mission.controller.ts
import { Request, Response } from 'express';
import * as missionService from '../services/mission.service';

export const getMissions = async (req: Request, res: Response) => {
  try {
    const missions = await missionService.getAllMissions();
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching missions', error });
  }
};
