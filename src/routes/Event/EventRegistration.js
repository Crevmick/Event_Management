import express from 'express';
import { registerForEvent, getRegistrationsForEvent } from '../../controller/RegisterForEvent.js';
import  authenticateUser from '../../middleware/authenticateUser.js';

const router = express.Router();

// Public route to register for an event
router.post('/register', registerForEvent);

router.get('/:eventId/registrations', authenticateUser,  getRegistrationsForEvent);

export default router;
