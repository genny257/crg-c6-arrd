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
exports.updateVolunteerStatus = exports.getVolunteerById = exports.createVolunteer = exports.getVolunteers = void 0;
const volunteerService = __importStar(require("../services/volunteer.service"));
const zod_1 = require("zod");
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await volunteerService.getAllVolunteers();
        res.json(volunteers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching volunteers', error });
    }
};
exports.getVolunteers = getVolunteers;
const createVolunteer = async (req, res) => {
    try {
        // TODO: Validate req.body with a Zod schema
        const volunteer = await volunteerService.createVolunteer(req.body);
        res.status(201).json(volunteer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating volunteer', error });
    }
};
exports.createVolunteer = createVolunteer;
const getVolunteerById = async (req, res) => {
    try {
        const volunteer = await volunteerService.getVolunteerById(req.params.id);
        if (volunteer) {
            res.json(volunteer);
        }
        else {
            res.status(404).json({ message: 'Volunteer not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching volunteer', error });
    }
};
exports.getVolunteerById = getVolunteerById;
const statusUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'REJECTED', 'PENDING']),
});
const updateVolunteerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = statusUpdateSchema.parse(req.body);
        const updatedVolunteer = await volunteerService.updateVolunteerStatus(id, status);
        res.json(updatedVolunteer);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.issues });
        }
        res.status(500).json({ message: 'Error updating volunteer status', error });
    }
};
exports.updateVolunteerStatus = updateVolunteerStatus;
