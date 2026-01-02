const bcrypt= require('bcrypt');
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

        // res.status(200).json({message: "Login Successfull!"});

        // MODIFICATION: Return the user info! 
        // The frontend needs this '_id' to create games later.
        res.status(200).json({
            message: "Login Successful!",
            user: {
                _id: isPlayer._id,
                userName: isPlayer.userName
            }
        });
    }
    catch(err){
        console.log("Login Error");
        console.log(err);
        res.status(500).json({message: 'Unexpected Error Occured!'});
    }
}

module.exports= {login, signUp};