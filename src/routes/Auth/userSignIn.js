import express from 'express';
//mongodb user model
import User from '../../model/user.js';

//password handler
import bcrypt from 'bcryptjs';
// JWT creator helper
import createToken from '../../../util/createToken.js';


const router = express.Router();

router.post('/', async (req, res) => {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.json({
                status: "FAILED",
                message: "Invalid credentials entered"
            });
        }

        let hashedPassword = user.password;
        let passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            return res.json({
                status: "FAILED",
                message: "Invalid credentials entered"
            });
        }

         //  Create a JWT token after successful login
         const token = await createToken({ userId: user._id });

        // Success
        return res.json({
            status: "SUCCESS",
            message: "Signed in successfully",
            token, // sending the token
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                verified: user.verified
            }
        });

    } catch (err) {
        console.error(err);
        return res.json({
            status: "FAILED",
            message: "An error occurred while signing in"
        });
    }
});

export default router;