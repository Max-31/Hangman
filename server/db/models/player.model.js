const mongoose= require('mongoose');

const playerSchema= new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Please Enter UserName!"],
            unique: [true, "UserName Already Exists!"],
            trim: true
        },
        password: {
            type: String,
            required: [true, "Please Enter Password!"]
        },
        role: {
            type: String,
            enum: ['player', 'admin'],
            default: 'player'
        },
        guessingPower: {
            type: Number,
            default: 0
        },
        highScore: {
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
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            type: String
        },
        otpExpiry: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const Player= mongoose.model('Player', playerSchema);
module.exports= Player;