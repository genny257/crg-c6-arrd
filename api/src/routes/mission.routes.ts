// src/routes/mission.routes.ts
import { Router } from 'express';
import * as missionController from '../controllers/mission.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Volunteer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: L'identifiant unique du volontaire.
 *         matricule:
 *           type: string
 *           description: Le numéro de matricule du volontaire.
 *         firstName:
 *           type: string
 *           description: Le prénom du volontaire.
 *         lastName:
 *           type: string
 *           description: Le nom de famille du volontaire.
 *         email:
 *           type: string
 *           format: email
 *           description: L'adresse e-mail du volontaire.
 *         phone:
 *           type: string
 *           description: Le numéro de téléphone du volontaire.
 *     Mission:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: string
 *           description: L'identifiant unique de la mission.
 *         title:
 *           type: string
 *           description: Le titre de la mission.
 *         description:
 *           type: string
 *           description: La description de la mission.
 *         location:
 *           type: string
 *           description: Le lieu de la mission.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: La date de début de la mission.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: La date de fin de la mission.
 *         status:
 *           type: string
 *           enum: [Planifiee, En_cours, Terminee, Annulee]
 *           description: Le statut de la mission.
 *         requiredSkills:
 *           type: array
 *           items:
 *             type: string
 *           description: Les compétences requises pour la mission.
 *         maxParticipants:
 *           type: integer
 *           description: Le nombre maximum de participants.
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Volunteer'
 *           description: La liste des volontaires participant à la mission.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: La date de création de la mission.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: La date de la dernière mise à jour de la mission.
 */

/**
 * @swagger
 * tags:
 *   name: Missions
 *   description: API pour la gestion des missions
 */

/**
 * @swagger
 * /missions:
 *   get:
 *     summary: Récupère la liste de toutes les missions
 *     tags: [Missions]
 *     responses:
 *       200:
 *         description: La liste de toutes les missions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mission'
 *       500:
 *         description: Erreur serveur lors de la récupération des missions.
 */
router.get('/missions', missionController.getMissions);

export default router;