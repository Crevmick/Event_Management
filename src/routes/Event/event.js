import express from 'express';
import authenticateUser from '../../middleware/authenticateUser.js';  // Authentication middleware
import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../../controller/EventController.js';

const router = express.Router();

// Apply both authentication and role-based authorization for createEvent
router.post('/', authenticateUser, createEvent);

// Apply both authentication and role-based authorization for deleteEvent
router.delete('/:id', authenticateUser, deleteEvent);

// Apply both authentication and role-based authorization for getAllEvents
router.get('/', authenticateUser, getAllEvents);

// Apply both authentication and role-based authorization for getEvent
router.get('/:id', authenticateUser,  getEvent);

// Apply both authentication and role-based authorization for updateEvent
router.put('/:id', authenticateUser, updateEvent);

export default router;
