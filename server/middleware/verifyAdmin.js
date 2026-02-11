const verifyAdmin= async(req, res, next)=>{
    try{
        if(req.user && req.user.role === 'admin'){
            next();
        }
        else{
            return res.status(403).json({ message: "Access Denied: Admins Only!" });
        }
    }
    catch(err){
        console.log("Error in verifyAdmin middleware:");
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {verifyAdmin};