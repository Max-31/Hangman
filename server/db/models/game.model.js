const mongoose= require('mongoose');
// const Genre = require('./genre.model');
// const Player = require('./player.model');

const gameSchema= new mongoose.Schema(
    {
        userID: { // now stores playerID
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
            // type: String,
            // trim: true,
            // required: true
        },
        word: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
            // type: String,
            // required: true
        },
        hiddenWord: {
            type: String,
            required: true
        },
        remainingAttempts: {
            type: Number,
            default: 6
        },
        guessedLetters: {
            type: [String],
            default: []
        },
        guessedWords: {
            type: [String],
            default: []
        },
        isOver: {
            type: Boolean,
            default: false
        },
        isWin: {
            type: Boolean,
            default: null
        }
        // will be obtained from word.model.js
        //via .populate('word')
        // genre: {
            //     // type: String,
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'Genre',
            // },
            // contributor: {
                //     // type: String,
                //     type: mongoose.Schema.Types.ObjectId,
                //     ref: 'Player',
                //     // default: "System"
                // }
                
            // wordMap: {
            //     type: Object,
            //     required: true
            // },
            // wordPos: {
            //     type: Object,
            //     required: true
            // },

    },
    {
        timestamps: true
    }
)

const Game= mongoose.model("Game", gameSchema);
module.exports= Game;