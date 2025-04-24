import express from 'express';
import { registerUser, sendPasswordResetOTPEmail} from '../../controller/SignUpAuthController.js';
import UserOTPVerification from '../../model/UserOTPVerification.js';
import User from '../../model/user.js';
import bcrypt from 'bcryptjs';
import passport from '../../config/passportConfig.js'


const router = express.Router();

router.post('/', registerUser);

//Verify otp email
router.post('/verifyOTP', async (req, res) => {
    try{
        let { userId, otp } = req.body;
        if (!userId || !otp ) {
            throw Error("otp details are not allowed");            
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({
                userId,
            });
            if (UserOTPVerificationRecords.length <= 0) {
                throw new Error(
                    "Accont record not verify, please sign up again"
                );
            } else {
                // user otp record exixts
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if (expiresAt  < Date.now()) {
                    await UserOTPVerification.deleteMany({ userId});
                    throw new error("Code has expired. Please request again");
                } else {
                    const vaildOTP = await bcrypt.compare(otp, hashedOTP);

                    if(!vaildOTP) {
                        throw new Error("invalid code passed")
                    } else {
                    await User.updateOne({ _id: userId}, {verifield: true});
                    await UserOTPVerification.deleteMany({ userId });
                    res.json({
                        status: "VERIFIED",
                        message: 'user email verified successfully'
                    });
                    }
                }
            }
        }
    } catch (error){
        res.json({
            status: "FAILED",
            message: error.message
        });
    }

});

router.post("/resendOTPVerificationCode", async (req, res) => {
    try {
      let { userId, email } = req.body;
  
      if (!userId || !email) {
        throw Error("Empty user detail not allowed");
      }
  
      // delete existing OTP record
      await UserOTPVerification.deleteMany({ userId });
  
      // resend new OTP
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

  router.post("/forget_password", async(req, res) => {
    try {
        const {email} = req.body;
        if (!email) throw Error("An email is required");
       const createdPasswordResetOTP = await sendPasswordResetOTPEmail(email); 
       res.status(200).json(createdPasswordResetOTP)
    } catch (error) {
        res.status(400).send(error.message)
    }

    })


    

export default router;
