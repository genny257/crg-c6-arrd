// src/routes/event.routes.ts
import { Router } from 'express';
import * as eventController from '../controllers/event.controller';

const router = Router();

router.get('/events/featured', eventController.getFeaturedEvents);

router.route('/events')
    .get(eventController.getEvents)
    .post(eventController.createEvent);

router.route('/events/:id')
    .get(eventController.getEventById)
    .put(eventController.updateEvent)
    .delete(eventController.deleteEvent);

export default router;
