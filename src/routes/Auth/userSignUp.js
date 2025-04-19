import express from 'express';
//mongodb user model
import User from '../../model/user.js';

//password handler
import bcrypt from 'bcryptjs';
// JWT creator helper
import createToken from '../../../util/createToken.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;

    name = name.trim();
    email = email.trim();
    password = password.trim();

    // Validation
    if (!name || !email || !password || !dateOfBirth) {
        return res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    }

    if (!/^[a-zA-Z ]*$/.test(name)) {
        return res.json({
            status: "FAILED",
            message: "Invalid name"
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    }

    if (isNaN(new Date(dateOfBirth).getTime())) {
        return res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        });
    }

    if (password.length < 8) {
        return res.json({
            status: "FAILED",
            message: "Password is too short!"
        });
    }

    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: "Email already exists!"
            });
        }

        let saltRounds = 10;
        let hashedPassword = await bcrypt.hash(password, saltRounds);

        let newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth
        });

        let savedUser = await newUser.save();

         //  Create a JWT token after successful signup
         const token = await createToken({ userId: savedUser._id });

         // Send the token and user data in response
         return res.json({
             status: "SUCCESS",
             message: "Signup successful",
             token, // sending the token
             data: {
                 id: savedUser._id,
                 name: savedUser.name,
                 email: savedUser.email,
                 verified: savedUser.verified
             }
         });
    } catch (error) {
        console.log(error);
        return res.json({
            status: "FAILED",
            message: "An error occurred while processing your request"
        });
    }
});
export default router;

