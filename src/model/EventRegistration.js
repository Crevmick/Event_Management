import mongoose from 'mongoose';
const { Schema } = mongoose;

const RegistrationSchema = new Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
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
    timestamps: true
});


const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

export default Registration;
