import bcrypt from 'bcryptjs';
import User from  '../model/User.js';
import createToken from '../../util/createToken.js';
import sendOTP from '../../util/sendOTP.js';

export const registerUser = async (req, res) => {
  let { name, email, password, dateOfBirth, role, adminSecret } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

  // Basic validation
  if (!name || !email || !password || !dateOfBirth) {
    return res.json({ status: "FAILED", message: "Empty input fields!" });
  }

  if (!/^[a-zA-Z ]*$/.test(name)) {
    return res.json({ status: "FAILED", message: "Invalid name" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.json({ status: "FAILED", message: "Invalid email entered" });
  }

  if (isNaN(new Date(dateOfBirth).getTime())) {
    return res.json({ status: "FAILED", message: "Invalid date of birth" });
  }

  if (password.length < 8) {
    return res.json({ status: "FAILED", message: "Password is too short!" });
  }

  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ status: "FAILED", message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle role safely
    const allowedRoles = ['attendee', 'event-organizer', 'admin'];
    role = role?.trim().toLowerCase() || 'attendee';

    if (!allowedRoles.includes(role)) {
      role = 'attendee'; // fallback if invalid role provided
    }

    if (role === 'admin') {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.json({ status: "FAILED", message: "Invalid admin secret key!" });
      }
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      dateOfBirth,
      verified: false,
    });

    const savedUser = await newUser.save();

    const otpResponse = await sendOTP(savedUser);

    if (!otpResponse.success) {
      return res.json({ status: "FAILED", message: otpResponse.message });
    }

    const token = await createToken({
      _id: savedUser._id,
      role: savedUser.role,
    });

    
    
    return res.json({
      status: "SUCCESS",
      message: "Signup successful. OTP sent to email.",
      token,
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        verified: savedUser.verified,
        role: savedUser.role,
        otpInfo: otpResponse.data,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error); // Better logging
    return res.json({
      status: "FAILED",
      message: error.message || "An error occurred while processing your request",
    });
  }
};



export const sendPasswordResetOTPEmail = async (email) => {
    try {
        //check if an account exists
        const existingUser = await User.findOne({ email });
        if (!existingUser){
            throw Error("There is no account for the provided email.");
        }

        if (!existingUser.verified) {
            throw Error("Email hasn't been verified yet. Check your inbox.");
        }

        const otpDetails = {
        email,
        subject: "Password Reset",
        message: "Enter the code below to reset your password.",
        duration: 1,
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    
    } catch (error) {
       throw error;

    }
}
