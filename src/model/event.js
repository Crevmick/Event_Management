const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Reference to event category
    description: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Event organizer (User)
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  // List of users attending the event
});

const Event = mongoose.model('Event', eventSchema);
