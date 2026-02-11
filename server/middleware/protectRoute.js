const jwt= require('jsonwebtoken');
// const Player= require('../db/models/player.model');

const protectRoute= async(req, res, next)=>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ message: "Unauthorized: No Token Provided!"});
        }
        
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized: Invalid Token!"});
        }

        // const user= Player.findById(decoded.userID).select("-password"); //excluded the password field
        // if(!user){
        //     return res.status(404).json({ message: "User NOT Found!"});
        // }
        // req.user= user;
        req.user = {
            _id: decoded.userID,
            role: decoded.role
        }

        next();
    }
    catch(err){
        console.log("Error in protectRoute middleware", err.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

module.exports= { protectRoute };