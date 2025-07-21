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
exports.deleteMission = exports.updateMission = exports.createMission = exports.getMissionById = exports.getMissions = void 0;
const missionService = __importStar(require("../services/mission.service"));
/**
 * Récupère toutes les missions.
 */
const getMissions = async (req, res) => {
    try {
        const missions = await missionService.getAllMissions();
        res.status(200).json(missions);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions.', error });
    }
};
exports.getMissions = getMissions;
/**
 * Récupère une mission par son ID.
 */
const getMissionById = async (req, res) => {
    try {
        const mission = await missionService.getMissionById(req.params.id);
        if (mission) {
            res.status(200).json(mission);
        }
        else {
            res.status(404).json({ message: 'Mission non trouvée.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la mission.', error });
    }
};
exports.getMissionById = getMissionById;
/**
 * Crée une nouvelle mission.
 */
const createMission = async (req, res) => {
    try {
        const newMission = await missionService.createMission(req.body);
        res.status(201).json(newMission);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la mission.', error });
    }
};
exports.createMission = createMission;
/**
 * Met à jour une mission existante.
 */
const updateMission = async (req, res) => {
    try {
        const updatedMission = await missionService.updateMission(req.params.id, req.body);
        res.status(200).json(updatedMission);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la mission.', error });
    }
};
exports.updateMission = updateMission;
/**
 * Supprime une mission.
 */
const deleteMission = async (req, res) => {
    try {
        await missionService.deleteMission(req.params.id);
        res.status(204).send(); // No Content
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la mission.', error });
    }
};
exports.deleteMission = deleteMission;
