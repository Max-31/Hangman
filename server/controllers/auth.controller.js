const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const Player= require('../db/models/player.model');

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

module.exports= {login, signUp, logout};