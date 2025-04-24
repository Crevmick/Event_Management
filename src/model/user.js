import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if googleId is not present
        },
    },
    dateOfBirth: {
        type: Date,
        required: function() {
            // Make dateOfBirth required only for traditional sign-up, not Google sign-up
            return !this.googleId;
        },
    },
    verified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: null  
    },
    role: { 
        type: String, 
        enum: ['admin', 'event-organizer', 'attendee'], 
        default: 'attendee' 
    },
    eventsOrganized: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    
    googleId: { 
        type: String, 
        unique: true, 
        required: false  
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const User = mongoose.model('User', UserSchema);

export default User;
