"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/mission.routes.ts
const express_1 = require("express");
const missionController = __importStar(require("../controllers/mission.controller"));
const router = (0, express_1.Router)();
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
 *         firstName:
 *           type: string
 *           description: Le prénom du volontaire.
 *         lastName:
 *           type: string
 *           description: Le nom de famille du volontaire.
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
 *           description: L'identifiant auto-généré de la mission.
 *         title:
 *           type: string
 *           description: Le titre de la mission.
 *         description:
 *           type: string
 *           description: La description détaillée de la mission.
 *         location:
 *           type: string
 *           description: Le lieu où se déroule la mission.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure de début de la mission.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure de fin de la mission.
 *         status:
 *           type: string
 *           enum: [Planifiee, En_cours, Terminee, Annulee]
 *           description: Le statut actuel de la mission.
 *         requiredSkills:
 *           type: array
 *           items:
 *             type: string
 *           description: Les compétences requises pour participer.
 *         maxParticipants:
 *           type: integer
 *           nullable: true
 *           description: Le nombre maximum de participants autorisés.
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Volunteer'
 *           description: La liste des volontaires inscrits à la mission.
 *
 * tags:
 *   name: Missions
 *   description: API pour la gestion des missions
 */
// --- Routes pour /missions ---
/**
 * @swagger
 * /missions:
 *   get:
 *     summary: Récupère la liste de toutes les missions
 *     tags: [Missions]
 *     responses:
 *       200:
 *         description: Une liste de missions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mission'
 *   post:
 *     summary: Crée une nouvelle mission
 *     tags: [Missions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       201:
 *         description: La mission a été créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       500:
 *         description: Erreur serveur.
 */
router.route('/missions')
    .get(missionController.getMissions)
    .post(missionController.createMission);
// --- Routes pour /missions/:id ---
/**
 * @swagger
 * /missions/{id}:
 *   get:
 *     summary: Récupère une mission par son ID
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la mission
 *     responses:
 *       200:
 *         description: Les détails de la mission.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       404:
 *         description: Mission non trouvée.
 *   put:
 *     summary: Met à jour une mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la mission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       200:
 *         description: Mission mise à jour avec succès.
 *       404:
 *         description: Mission non trouvée.
 *   delete:
 *     summary: Supprime une mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la mission
 *     responses:
 *       204:
 *         description: Mission supprimée avec succès.
 *       404:
 *         description: Mission non trouvée.
 */
router.route('/missions/:id')
    .get(missionController.getMissionById)
    .put(missionController.updateMission)
    .delete(missionController.deleteMission);
exports.default = router;
