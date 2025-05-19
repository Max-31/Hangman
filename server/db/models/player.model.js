const mongoose= require('mongoose');

const playerSchema= new mongoose.Schema(
    {
        // email: {
        //     type: String,
        //     required: [true, "Please Enter Email!"],
        //     unique: [true, "Email Already Exists!"]
        // },
        userName: {
            type: String,
            required: [true, "Please Enter UserName!"],
            unique: [true, "UserName Already Exists!"]
        },
        password: {
            type: String,
            required: [true, "Please Enter Password!"]
        },
        guessingPower: {
            type: Number,
            default: 0
        },
        score: {
            type: Number,
            default: 0
        },
        wins: {
            type: Number,
            default: 0
        },
        losses: {
            type: Number,
            default: 0
        }
        
    },
    {
        timestamps: true
    }
);

const Player= mongoose.model('Player', playerSchema);
module.exports= Player;