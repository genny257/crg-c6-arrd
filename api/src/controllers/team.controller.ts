// src/controllers/team.controller.ts
import { Request, Response } from 'express';
import * as teamService from '../services/team.service';
import { z } from 'zod';
import { PoolType } from '@prisma/client';

export const getTeamStructure = async (req: Request, res: Response) => {
    try {
        const teamStructure = await teamService.getTeamStructure();
        res.status(200).json(teamStructure);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team structure', error });
    }
};

// --- Team Roles ---

const roleSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

export const getTeamRoles = async (req: Request, res: Response) => {
  try {
    const roles = await teamService.getAllTeamRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team roles", error });
  }
};

export const createTeamRole = async (req: Request, res: Response) => {
    try {
        const data = roleSchema.parse(req.body);
        const role = await teamService.createTeamRole(data);
        res.status(201).json(role);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json(error.errors);
        res.status(500).json({ message: "Error creating team role", error });
    }
};

export const updateTeamRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = roleSchema.partial().parse(req.body);
        const role = await teamService.updateTeamRole(id, data);
        res.json(role);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json(error.errors);
        res.status(500).json({ message: "Error updating team role", error });
    }
};

export const deleteTeamRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await teamService.deleteTeamRole(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting team role", error });
    }
};


// --- Team Pools ---
const poolSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    iconKey: z.string().optional(),
    type: z.nativeEnum(PoolType),
});

export const getTeamPools = async (req: Request, res: Response) => {
    try {
        const pools = await teamService.getAllTeamPools();
        res.json(pools);
    } catch (error) {
        res.status(500).json({ message: "Error fetching team pools", error });
    }
};

export const createTeamPool = async (req: Request, res: Response) => {
    try {
        const data = poolSchema.parse(req.body);
        const pool = await teamService.createTeamPool(data);
        res.status(201).json(pool);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json(error.errors);
        res.status(500).json({ message: "Error creating team pool", error });
    }
};

export const updateTeamPool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = poolSchema.partial().parse(req.body);
        const pool = await teamService.updateTeamPool(id, data);
        res.json(pool);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json(error.errors);
        res.status(500).json({ message: "Error updating team pool", error });
    }
};

export const deleteTeamPool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await teamService.deleteTeamPool(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting team pool", error });
    }
};

// --- Assignments ---
const assignRoleSchema = z.object({
    userId: z.string(),
    roleId: z.string().nullable(),
});
export const assignRoleToUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleId } = assignRoleSchema.parse(req.body);
        const user = await teamService.assignUserToRole(userId, roleId);
        res.json(user);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json(error.errors);
        res.status(500).json({ message: "Error assigning role", error });
    }
};

const assignCoordinatorSchema = z.object({
    poolId: z.string(),
    userId: z.string(),
});
export const assignCoordinator = async (req: Request, res: Response) => {
    try {
        const { poolId, userId } = assignCoordinatorSchema.parse(req.body);
        const pool = await teamService.assignCoordinatorToPool(poolId, userId);
        res.json(pool);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json(error.errors);
        res.status(500).json({ message: "Error assigning coordinator", error });
    }
};

export const removeCoordinator = async (req: Request, res: Response) => {
    try {
        const { poolId, userId } = assignCoordinatorSchema.parse(req.body);
        const pool = await teamService.removeCoordinatorFromPool(poolId, userId);
        res.json(pool);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json(error.errors);
        res.status(500).json({ message: "Error removing coordinator", error });
    }
};
