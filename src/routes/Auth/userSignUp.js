import express from 'express';
import { 
  registerUser, 
  registerUserValidationRules,
  sendPasswordResetOTPEmail,
  sendPasswordResetOTPEmailValidationRules,
  resetPassword,
  resetPasswordValidationRules
} from '../../controller/SignUpAuthController.js';
import UserOTPVerification from '../../model/UserOTPVerification.js';
import User from '../../model/User.js';
import bcrypt from 'bcryptjs';
import createToken from '../../../util/createToken.js';
import sendOTP from '../../../util/sendOTP.js';

const router = express.Router();

// Register route
router.post('/', registerUserValidationRules(), registerUser);

// Verify OTP route
// TODO: Add express-validator rules for userId and otp
router.post('/verifyOTP', async (req, res) => {
  try {
    let { userId, otp } = req.body;

    if (!userId || !otp) {
      throw new Error("OTP details are required");
    }

    const otpRecords = await UserOTPVerification.find({ userId });

    if (otpRecords.length === 0) {
      throw new Error("Account record not found or already verified. Please sign up again.");
    }

    const { expiresAt, otp: hashedOTP } = otpRecords[0];

    if (expiresAt < Date.now()) {
      await UserOTPVerification.deleteMany({ userId });
      throw new Error("Code has expired. Please request again");
    }

    const validOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validOTP) {
      throw new Error("Invalid code passed");
    }

    await User.updateOne({ _id: userId }, { verified: true });
    await UserOTPVerification.deleteMany({ userId });

    const user = await User.findById(userId);
    const token = await createToken({ userId: user._id, role: user.role });
    res.json({
      status: "VERIFIED",
      message: "User email verified successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        role: user.role,
      },
    });

  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// Resend OTP route
router.post("/resendOTPVerificationCode", async (req, res) => {
  try {
    let { userId, email } = req.body;

    if (!userId || !email) {
      throw new Error("Empty user detail not allowed");
    }

    await UserOTPVerification.deleteMany({ userId });

    const response = await sendOTP({ email, userId });

    return res.json({
      status: "SUCCESS",
      message: "OTP resent successfully",
      data: response.data,
    });

  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// Forgot password route (sends password reset OTP)
router.post("/forget_password", sendPasswordResetOTPEmailValidationRules(), sendPasswordResetOTPEmail);

// Reset password route
router.post('/reset-password', resetPasswordValidationRules(), resetPassword);

export default router;
