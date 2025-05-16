const mongoose= require('mongoose');

const gameSchema= new mongoose.Schema(
    {
        userName: {
            type: String,
            trim: true,
            required: true
        },
        word: {
            type: String,
            required: true
        },
        wordMap: {
            type: Object,
            required: true
        },
        wordPos: {
            type: Object,
            required: true
        },
        hiddenWord: {
            type: String,
            required: true
        },
        remainingAttempts: {
            type: Number,
            default: 6
        },
        guessLetters: {
            type: [String],
            default: []
        },
        genre: {
            type: [String], //later upgrade to enum
        }
        // isOver: {
        //     type: Boolean,
        //     default: false
        // },
        // isWin: {
        //     type: Boolean,
        //     default: null
        // }
    },
    {
        timestamps: true
    }
)

const Game= mongoose.model("Game", gameSchema);
module.exports= Game;