import mongoose from 'mongoose';

const { Schema } = mongoose;
const attendeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    registrationDate: { type: Date, default: Date.now },
});

const Attendee = mongoose.model('Attendee', attendeeSchema);
