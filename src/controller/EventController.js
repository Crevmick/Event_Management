import Event from '../model/event.js';
import mongoose from 'mongoose';  // Import mongoose

export const getAllEvents = async (req, res) => {
    
    try {
        const events = await Event.find()
            .select('title date location') // Only fetch necessary fields
            .limit(20) // Limit the number of events to 20
            .lean(); // Improve query speed

        res.status(200).json(events);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const createEvent = async (req, res) => {
//    // Temporary mock for testing - REMOVE after authentication is fixed
//    req.user = { userId: new mongoose.Types.ObjectId(), role: 'admin' };  // Use 'new' here
    try {
        const { title, date, location, description } = req.body;
        const userId = req.user.userId;  

        if (!title || !date || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newEvent = new Event({
            title,
            date,
            location,
            description,
            createdBy: userId,  // Add the user ID to the event
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

        const event = await Event.findById(id)
            .select('title date location description') // Only select needed fields
            .lean();

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
        const userId = req.user.userId; // Get the authenticated user's ID from req.user

        // First, find the event without updating
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Convert both createdBy and userId to strings to ensure correct comparison
        const eventCreatorId = event.createdBy.toString(); 
        const authenticatedUserId = userId.toString(); 

        // Check if the authenticated user is the owner
        if (eventCreatorId !== authenticatedUserId) {
            return res.status(403).json({ message: "You do not have permission to update this event" });
        }

        // Proceed with update after permission is verified
        event.title = title;
        event.date = date;
        event.location = location;
        event.description = description;

        const updatedEvent = await event.save();

        res.status(200).json(updatedEvent);

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
