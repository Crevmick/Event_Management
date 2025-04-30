import Registration from '../model/EventRegistration.js';
import Event from '../model/event.js';

export const registerForEvent = async (req, res) => {
    const { name, email, eventId } = req.body;

    try {
        // Find the event to ensure it exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send('Event not found');
        }

        // Check if the user is already registered for this event
        const existingRegistration = await Registration.findOne({ email, event: eventId });
        if (existingRegistration) {
            return res.status(400).send('You are already registered for this event');
        }

        // Create a new registration record
        const registration = new Registration({
            name,
            email,
            event: eventId,
        });

        // Save the registration record
        await registration.save();

        return res.status(200).send('Registration successful');
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Something went wrong during registration', error: error.message });
    }
};


export const getRegistrationsForEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        // Find all registrations for the specified event
        const registrations = await Registration.find({ event: eventId }).populate('name email'); // Populate user info if needed

        if (!registrations.length) {
            return res.status(404).json({ message: 'No registrations found for this event' });
        }

        return res.status(200).json({ registrations });
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};
