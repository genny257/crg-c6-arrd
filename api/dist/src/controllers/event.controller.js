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
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.createEvent = exports.getFeaturedEvents = exports.getEvents = void 0;
const eventService = __importStar(require("../services/event.service"));
const getEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};
exports.getEvents = getEvents;
const getFeaturedEvents = async (req, res) => {
    try {
        const events = await eventService.getFeaturedEvents();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching featured events', error });
    }
};
exports.getFeaturedEvents = getFeaturedEvents;
const createEvent = async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};
exports.createEvent = createEvent;
const getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if (event) {
            res.json(event);
        }
        else {
            res.status(404).json({ message: 'Event not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching event', error });
    }
};
exports.getEventById = getEventById;
const updateEvent = async (req, res) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body);
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        await eventService.deleteEvent(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};
exports.deleteEvent = deleteEvent;
