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
exports.deleteReport = exports.updateReport = exports.getReportById = exports.createReport = exports.getReports = void 0;
const reportService = __importStar(require("../services/report.service"));
const getReports = async (req, res) => {
    try {
        const reports = await reportService.getAllReports();
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error });
    }
};
exports.getReports = getReports;
const createReport = async (req, res) => {
    try {
        const report = await reportService.createReport(req.body);
        res.status(201).json(report);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating report', error });
    }
};
exports.createReport = createReport;
const getReportById = async (req, res) => {
    try {
        const report = await reportService.getReportById(req.params.id);
        if (report) {
            res.json(report);
        }
        else {
            res.status(404).json({ message: 'Report not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching report', error });
    }
};
exports.getReportById = getReportById;
const updateReport = async (req, res) => {
    try {
        const report = await reportService.updateReport(req.params.id, req.body);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating report', error });
    }
};
exports.updateReport = updateReport;
const deleteReport = async (req, res) => {
    try {
        await reportService.deleteReport(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting report', error });
    }
};
exports.deleteReport = deleteReport;
