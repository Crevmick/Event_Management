import mongoose from 'mongoose';
import Category from './category.js';  // Import Category model
import User from './User.js';          // Import User model

const eventSchema = new mongoose.Schema({
    title: { type: String, 
        required: true },
    date: { type: Date, required: true },
    location: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Reference to event category
    description: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Event organizer (User)
    attendees: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: [] 
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }
});

const Event = mongoose.model('Event', eventSchema);


export default Event;