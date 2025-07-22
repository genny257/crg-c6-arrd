// src/routes/report.routes.ts
import { Router } from 'express';
import * as reportController from '../controllers/report.controller';

const router = Router();

router.route('/reports')
    .get(reportController.getReports)
    .post(reportController.createReport);

router.route('/reports/:id')
    .get(reportController.getReportById)
    .put(reportController.updateReport)
    .delete(reportController.deleteReport);

export default router;
