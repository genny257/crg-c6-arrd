// src/controllers/team.controller.ts
import { Request, Response } from 'express';
import * as teamService from '../services/team.service';

export const getTeamStructure = async (req: Request, res: Response) => {
    try {
        const teamStructure = await teamService.getTeamStructure();
        res.status(200).json(teamStructure);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team structure', error });
    }
};
