import express from 'express';
import authenticateUser from '../../middleware/authenticateUser.js';  // Authentication middleware
import authorizeRoles from '../../middleware/authorizeRoles.js';      // Authorization middleware
import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../../controller/EventController.js';

const router = express.Router();

// Apply both authentication and role-based authorization for createEvent
router.post('/', authenticateUser, authorizeRoles('admin', 'organizer'), createEvent);

// Apply both authentication and role-based authorization for deleteEvent
router.delete('/:id', authenticateUser, authorizeRoles('admin', 'organizer'), deleteEvent);

// Apply both authentication and role-based authorization for getAllEvents
router.get('/', authenticateUser, authorizeRoles('admin', 'organizer'), getAllEvents);

// Apply both authentication and role-based authorization for getEvent
router.get('/:id', authenticateUser, authorizeRoles('admin', 'organizer'), getEvent);

// Apply both authentication and role-based authorization for updateEvent
router.put('/:id', authenticateUser, authorizeRoles('admin', 'organizer'), updateEvent);

export default router;
