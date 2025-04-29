import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';

export const registerForEvent = async (req, res) => {
    const { userId, eventId } = req.body;

    // Find the event and user
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);


    if (!user || !event) {
        return res.status(404).send('User or Event not found');
    }

    // Check if the user is already registered for the event
    const existingRegistration = await Registration.findOne({ user: userId, event: eventId });

    if (existingRegistration) {
        return res.status(400).send('User is already registered for this event');
    }

    // Create a new registration record
    const registration = new Registration({
        user: userId,
        event: eventId,
    });

    await registration.save();

    // Add the user to the event's attendees list
    event.attendees.push(userId); // Add the user’s ObjectId
    await event.save();

    return res.status(200).send('Registration successful');
};


export const confirmRegistration = async (req, res) => {
    const { userId, eventId } = req.body;

    // Find the registration record
    const registration = await Registration.findOne({ user: userId, event: eventId });

    if (!registration) {
        return res.status(404).send('Registration not found');
    }

    // Change the status to confirmed
    registration.status = 'confirmed';
    await registration.save();

    return res.status(200).send('Registration confirmed');
};


export const cancelRegistration = async (req, res) => {
    const { userId, eventId } = req.body;

    // Find the registration record
    const registration = await Registration.findOne({ user: userId, event: eventId });

    if (!registration) {
        return res.status(404).send('Registration not found');
    }

    // Change the status to canceled
    registration.status = 'canceled';
    await registration.save();

    return res.status(200).send('Registration canceled');
};

