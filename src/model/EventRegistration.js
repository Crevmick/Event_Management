import mongoose from 'mongoose';
import User from '../';
import Event from '../model/event.js';

const { Schema } = mongoose;

const RegistrationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

export default Registration;
