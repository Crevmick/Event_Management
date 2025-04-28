import Event from '../model/event.js';

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const createEvent = async (req, res) => {
    try {
        const { title, date, location, description } = req.body;
        const userId = req.user.id; 

        if (!title || !date || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newEvent = new Event({
            title,
            date,
            location,
            description,
            createdBy: userId, // Add the user ID to the event
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}


export const getEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, location, description } = req.body;
        const userId = req.user.id; // Get the authenticated user's ID from req.user

        // Find and update the event
        const event = await Event.findByIdAndUpdate(id, {
            title,
            date,
            location,
            description,
        }, { new: true });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the authenticated user is the one who created the event
        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to update this event" });
        }

        res.status(200).json(event);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}


export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}
