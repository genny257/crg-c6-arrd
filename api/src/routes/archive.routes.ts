// src/routes/archive.routes.ts
import { Router } from 'express';
import * as archiveController from '../controllers/archive.controller';
import { protect } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Custom middleware to check for Admin or SuperAdmin roles
const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPERADMIN)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

// Protect all archive routes
router.use('/archive', protect, isAdmin);

/**
 * @swagger
 * tags:
 *   name: Archive
 *   description: Gestion des fichiers et des archives
 */

/**
 * @swagger
 * /archive:
 *   get:
 *     summary: Récupère les fichiers et dossiers d'un répertoire parent.
 *     tags: [Archive]
 *     parameters:
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: L'ID du dossier parent. Laisser vide pour la racine.
 *     responses:
 *       200:
 *         description: Une liste d'éléments d'archive.
 *       401:
 *         description: Non autorisé.
 */
router.get('/archive', archiveController.getItems);

/**
 * @swagger
 * /archive/folder:
 *   post:
 *     summary: Crée un nouveau dossier.
 *     tags: [Archive]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Le dossier a été créé avec succès.
 *       400:
 *         description: Données invalides.
 *       409:
 *         description: Un dossier avec le même nom existe déjà.
 */
router.post('/archive/folder', archiveController.createFolder);

/**
 * @swagger
 * /archive/file:
 *   post:
 *     summary: Crée une nouvelle entrée de fichier après téléversement.
 *     tags: [Archive]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               url:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Le fichier a été enregistré avec succès.
 *       400:
 *         description: Données invalides.
 */
router.post('/archive/file', archiveController.createFile);

export default router;

    