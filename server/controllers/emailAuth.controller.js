const Player = require('../db/models/player.model');
const sendEmail = require('../utils/sendEmail');

const sendOTP = async(req, res) => {
    try{
        const { userID, email } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await Player.findOne({ email: cleanEmail, _id: {$ne: userID} });
        if(existingUser && existingUser.isEmailVerified){
            return res.status(400).json({ message: "This email is already registered to another userName" });
        }

        const otp = Math.floor(100000 + Math.random()*900000).toString();
        const otpExpiry = new Date(Date.now() + 10*60*1000);

        const player = await Player.findById(userID);
        player.email = cleanEmail;
        player.otp = otp;
        player.otpExpiry = otpExpiry;
        await player.save();

        const emailBody = `
            <div style="background-color: #020126; padding: 40px 20px; font-family: 'Arial', sans-serif; color: #ffffff;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #0A0140; padding: 30px; border-radius: 12px; border: 1px solid #150259; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                    
                    <h2 style="color: #6863F2; margin-top: 0; text-align: center; border-bottom: 2px solid #4630D9; padding-bottom: 20px;">
                        Verify Your Email
                    </h2>

                    <div style="margin: 30px 0; text-align: center;">
                        <p style="margin: 12px 0; font-size: 16px; color: #ffffff; line-height: 1.5;">
                            You are about to make a Hangman Contribution. Please use the verification code below to verify your email address:
                        </p>
                        
                        <div style="background-color: #150259; margin: 30px auto; padding: 20px; border-radius: 8px; max-width: 250px; border: 2px dashed #4630D9;">
                            <strong style="font-size: 32px; color: #ffffff; letter-spacing: 5px;">${otp}</strong>
                        </div>

                        <p style="margin: 12px 0; font-size: 14px; color: #a0a0a0;">
                            This code expires in <strong style="color: #6863F2;">10 minutes</strong>.
                        </p>
                    </div>

                    <p style="text-align: center; color: #464660; font-size: 12px; margin-top: 40px;">
                        Hangman Game Automation System
                    </p>
                </div>
            </div>
        `;

        await sendEmail({
            to: cleanEmail,
            subject: "Your Hangman OTP Code",
            htmlContent: emailBody
        });

        res.status(200).json({ message: "OTP sent Successfully!" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP." });
    }
};

const verifyOTP = async(req, res) => {
    try{
        const { userID, otp } = req.body;

        const player = await Player.findById(userID);

        if(!player || player.otp !== otp){
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if(new Date() > player.otpExpiry){
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });;
        }

        player.isEmailVerified = true;
        player.otp = undefined;
        player.otpExpiry = undefined;
        await player.save();

        res.status(200).json({ message: "Email verified successfully" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Failed to verify OTP." });
    }
};

module.exports = { sendOTP, verifyOTP };