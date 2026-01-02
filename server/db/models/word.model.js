const mongoose= require('mongoose');
const Genre= require('./genre.model');
const Player= require('./player.model');

const wordSchema= mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        genre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Genre',
            required: true,
            // trim: true,
            // lowercase: true
        },
        contributor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            default: null
        },
        wordMap: {
            type: Object,
            required: true
        },
        wordPos: {
            type: Object,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Word= mongoose.model('Word', wordSchema);

module.exports= Word;