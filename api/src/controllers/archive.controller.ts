// src/controllers/archive.controller.ts
import { Request, Response } from 'express';
import * as archiveService from '../services/archive.service';
import { z } from 'zod';
import type { User } from '@prisma/client';
import { ArchiveItemType } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

const getItemsSchema = z.object({
  parentId: z.string().optional().nullable(),
});

export const getItems = async (req: Request, res: Response) => {
  try {
    const { parentId } = getItemsSchema.parse(req.query);
    const items = await archiveService.getArchiveItems(parentId || null);
    res.status(200).json(items);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Erreur lors de la récupération des archives.", error });
  }
};


const createFolderSchema = z.object({
  name: z.string().min(1, "Le nom du dossier est requis."),
  parentId: z.string().optional().nullable(),
});

export const createFolder = async (req: AuthRequest, res: Response) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const { name, parentId } = createFolderSchema.parse(req.body);
    const folder = await archiveService.createFolder(name, parentId || null, authorId);
    res.status(201).json(folder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
    }
     if (error instanceof Error && error.message.includes("existe déjà")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: "Erreur lors de la création du dossier.", error });
  }
};


const createFileSchema = z.object({
  name: z.string().min(1, "Le nom du fichier est requis."),
  type: z.nativeEnum(ArchiveItemType),
  url: z.string().url("L'URL est invalide."),
  parentId: z.string().optional().nullable(),
});

export const createFile = async (req: AuthRequest, res: Response) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const { name, type, url, parentId } = createFileSchema.parse(req.body);
    const file = await archiveService.createFile(name, type, url, parentId || null, authorId);
    res.status(201).json(file);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Erreur lors de la création du fichier.", error });
  }
};

    