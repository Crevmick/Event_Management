import Event from '../model/event.js';
import Category from '../model/category.js'; // Import the Category model
import mongoose from 'mongoose';  // Import mongoose

// Fetch all events with category populated
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .select('title date location category')  // Include category in the selection
            .populate('category', 'name description')  // Populate category details
            .limit(20) // Limit the number of events to 20
            .lean(); // Improve query speed

        res.status(200).json(events);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

// Create a new event with category
export const createEvent = async (req, res) => {
    try {
        const { title, date, location, description, categoryId } = req.body;
        const userId = req.user.userId;  // Assuming the user is authenticated

        if (!title || !date || !location || !categoryId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const newEvent = new Event({
            title,
            date,
            location,
            description,
            category: categoryId,  // Assign the category to the event
            createdBy: userId,  // Add the user ID to the event
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

// Fetch a specific event with its category populated
export const getEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .select('title date location description category')
            .populate('category', 'name description')  // Populate category details
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

// Update an event and its category
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, location, description, categoryId } = req.body;
        const userId = req.user.userId; // Get the authenticated user's ID from req.user

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const eventCreatorId = event.createdBy.toString();
        const authenticatedUserId = userId.toString();

        if (eventCreatorId !== authenticatedUserId) {
            return res.status(403).json({ message: "You do not have permission to update this event" });
        }

        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            event.category = categoryId;  // Update category if it's provided
        }

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

// Delete an event
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
