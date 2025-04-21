import bcrypt from 'bcryptjs';
import User from '../model/user.js';
import createToken from '../../util/createToken.js';
import sendOTP from '../../util/sendOTP.js';

export const registerUser = async (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;

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

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'attendee',
      dateOfBirth,
      verified: false,
    });

    const savedUser = await newUser.save();

    const otpResponse = await sendOTP(savedUser);

    if (!otpResponse.success) {
      return res.json({ status: "FAILED", message: otpResponse.message });
    }

    const token = await createToken({ userId: savedUser._id });

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
    console.log(error);
    return res.json({
      status: "FAILED",
      message: "An error occurred while processing your request",
    });
  }
};


export default  registerUser;