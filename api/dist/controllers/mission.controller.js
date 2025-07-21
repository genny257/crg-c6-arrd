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
exports.getMissions = void 0;
const missionService = __importStar(require("../services/mission.service"));
/**
 * Gère la requête pour obtenir toutes les missions.
 * Appelle le service de mission et renvoie les missions trouvées
 * ou un message d'erreur en cas de problème.
 * @param req - L'objet de requête Express.
 * @param res - L'objet de réponse Express.
 */
const getMissions = async (req, res) => {
    try {
        const missions = await missionService.getAllMissions();
        res.status(200).json(missions);
    }
    catch (error) {
        // En cas d'erreur, renvoyer une réponse 500 avec un message
        res.status(500).json({ message: 'Error fetching missions', error });
    }
};
exports.getMissions = getMissions;
