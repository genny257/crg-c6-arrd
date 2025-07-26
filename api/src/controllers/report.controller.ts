// src/controllers/report.controller.ts
import { Request, Response } from 'express';
import * as reportService from '../services/report.service';
import { z } from 'zod';

const reportSchema = z.object({
    title: z.string().min(1, "Le titre est requis."),
    fileUrl: z.string().url("L'URL du fichier n'est pas valide."),
    visible: z.boolean().default(false),
});

export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await reportService.getAllReports();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error });
    }
};

export const createReport = async (req: Request, res: Response) => {
    try {
        const validatedData = reportSchema.parse(req.body);
        const report = await reportService.createReport(validatedData);
        res.status(201).json(report);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation invalide', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error creating report', error });
    }
};

export const getReportById = async (req: Request, res: Response) => {
    try {
        const report = await reportService.getReportById(req.params.id);
        if (report) {
            res.json(report);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report', error });
    }
};

export const updateReport = async (req: Request, res: Response) => {
    try {
        const validatedData = reportSchema.partial().parse(req.body);
        const report = await reportService.updateReport(req.params.id, validatedData);
        res.json(report);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation invalide', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error updating report', error });
    }
};

export const deleteReport = async (req: Request, res: Response) => {
    try {
        await reportService.deleteReport(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting report', error });
    }
};
