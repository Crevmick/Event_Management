import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, 
        required: true },
    email: { type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    date: { type: Date, required: true },
    location: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Reference to event category
    description: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Event organizer (User)
    attendees: { 
        type: [String],
        default: [],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }
});

const Event = mongoose.model('Event', eventSchema);


export default Event;