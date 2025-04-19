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
        lowercase: true, // Ensures email is saved in lowercase
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    verified: {
        type: Boolean,
        default: false  // Assuming users are not verified by default
    },
    token: {
        type: String,
        default: null  
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', UserSchema);

export default User;
