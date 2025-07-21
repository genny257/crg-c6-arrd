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
exports.default = router;
