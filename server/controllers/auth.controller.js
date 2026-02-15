const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const Player= require('../db/models/player.model');
const sendEmail = require('../utils/sendEmail');

const signUp= async(req, res)=>{
    try{
        const {userName, password}= req.body;

        const isPlayer= await Player.findOne({userName});

        if(isPlayer){
            //409 for CONFLICT
            return res.status(409).json({
                playerExists: true,
                message: "Player with that UserName ALREADY EXISTS!"
            });
        }

        const saltRounds= 10;
        const hashPassword= await bcrypt.hash(password, saltRounds);

        const newPlayer= new Player({
            userName, 
            password: hashPassword
        });
        await newPlayer.save();

        res.status(201).json({
            playerExists: false,
            message: "Welcome to Hangman!"
        });
    }
    catch(err){
        console.log("SignUp Error");
        res.status(500).json({message: 'Unexpected Error Occured!'});
    }
}

const login= async(req, res)=>{
    try{
        const {userName, password}= req.body;

        const isPlayer= await Player.findOne({userName});
        
        if(!isPlayer){
            return res.status(404).json({message: "Player Not Found"});
        }

        // const isMatch= isPlayer.password === password;
        const isMatch= await bcrypt.compare(password, isPlayer.password);

        if(!isMatch){
            return res.status(401).json({message: "WRONG Password!"});
        }

        const tokenPayload = {
            userID: isPlayer._id,
            role: isPlayer.role
        }

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: '15d'});

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // I'm Using 'none' for cross-site (different domains)
            // If localhost then 'strict' is fine, but 'none' works if secure is true.
            // sameSite: 'strict',
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            
            // I'm Ensuring secure is true in production (which it is, thanks to your env var)
            secure: process.env.NODE_ENV !== "development"
        })

        // res.status(200).json({message: "Login Successfull!"});

        // MODIFICATION: Return the user info! 
        // The frontend needs this '_id' to create games later.
        res.status(200).json({
            message: "Login Successful!",
            user: {
                _id: isPlayer._id,
                userName: isPlayer.userName,
                role: isPlayer.role
            }
        });
    }
    catch(err){
        console.log("Login Error");
        console.log(err);
        res.status(500).json({message: 'Unexpected Error Occured!'});
    }
}

const logout = async(req, res)=>{
    try{
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out Successfully!"});
    }
    catch(err){
        console.log("Logout Error");
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const forgotPassword = async(req, res) => {
    try{
        const { email } = req.body;

        if(!email) return res.status(400).json({ message: "Email is required!" });

        const player = await Player.findOne({ email: email.toLowerCase().trim() });

        if(!player) {
            return res.status(404).json({ message: "This Email is NOT Verified and Linked with the Username." });

        }
        const otp = Math.floor(100000 + Math.random()*900000).toString();
        const otpExpiry = new Date(Date.now() + 10*60*1000);
    
        player.otp = otp;
        player.otpExpiry= otpExpiry;
        await player.save();

        const emailBody = `
            <div style="background-color: #020126; padding: 40px 20px; font-family: 'Arial', sans-serif; color: #ffffff;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #0A0140; padding: 30px; border-radius: 12px; border: 1px solid #150259; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                    
                    <h2 style="color: #6863F2; margin-top: 0; text-align: center; border-bottom: 2px solid #4630D9; padding-bottom: 20px;">
                        Password Reset Request
                    </h2>

                    <div style="margin: 30px 0; text-align: center;">
                        <p style="margin: 12px 0; font-size: 16px; color: #a0a0a0;">
                            You recently requested to reset your password for your Hangman account. Use the OTP below to complete the process.
                        </p>
                        
                        <div style="margin: 40px 0;">
                            <span style="background-color: #150259; color: #ffffff; padding: 15px 30px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border: 1px solid #6863F2; box-shadow: 0 0 15px rgba(104, 99, 242, 0.3);">
                                ${otp}
                            </span>
                        </div>

                        <p style="margin: 12px 0; font-size: 14px; color: #FFD700;">
                            ⚠️ This code expires in 10 minutes.
                        </p>
                        
                        <p style="margin: 12px 0; font-size: 14px; color: #a0a0a0;">
                            If you did not request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #150259; margin: 30px 0;">

                    <p style="text-align: center; color: #464660; font-size: 12px; margin-top: 20px;">
                        Hangman Game Security System
                    </p>
                </div>
            </div>
        `;

        await sendEmail ({
            to: player.email,
            subject: "Hangman Password Reset OTP",
            htmlContent: emailBody
        });

        res.status(200).json({ message: "OTP sent to your email!" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

const resetPassword = async(req,res)=>{
    try{
        const { email, otp, newPassword }= req.body;
        if(!email || !otp || !newPassword){
            return res.status(400).json({ message: "All fields are Required" });
        }

        const player = await Player.findOne({ email: email.toLowerCase().trim() });
        if(!player){
            return res.status(404).json({ message: "Player Not Found!" });
        }

        if(player.otp !== otp){
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if(new Date() > player.otpExpiry){
            return res.status(400).json({ message: "OTP has expired" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        player.password = hashedPassword;
        player.otp = undefined;
        player.otpExpiry = undefined;
        await player.save();

        res.status(200).json({ message: "Password reset Successfu! You can login now." });
    }
    catch(err){
        return res.status(500).json({ message: "Server Error" });
    }
}


module.exports= {
    login, 
    signUp, 
    logout,
    forgotPassword,
    resetPassword
};