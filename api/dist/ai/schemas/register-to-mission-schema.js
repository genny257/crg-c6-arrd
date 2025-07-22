"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterToMissionOutputSchema = exports.RegisterToMissionInputSchema = void 0;
const zod_1 = require("zod");
exports.RegisterToMissionInputSchema = zod_1.z.object({
    missionId: zod_1.z.string().describe('The ID of the mission.'),
    matricule: zod_1.z
        .string()
        .min(1, 'Le matricule est requis.')
        .describe('The matricule of the volunteer.'),
});
exports.RegisterToMissionOutputSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
