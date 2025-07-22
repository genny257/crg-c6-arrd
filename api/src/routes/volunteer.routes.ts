// src/routes/volunteer.routes.ts
import { Router } from 'express';
import * as volunteerController from '../controllers/volunteer.controller';

const router = Router();

router.route('/volunteers')
  .get(volunteerController.getVolunteers)
  .post(volunteerController.createVolunteer);

router.route('/volunteers/:id')
  .get(volunteerController.getVolunteerById)
  .put(volunteerController.updateVolunteer)
  .delete(volunteerController.deleteVolunteer);

export default router;
