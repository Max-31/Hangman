const mongoose= require('mongoose');

const wordSchema= mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        genre: {
            type: String,
            required: true,
            trim: true,
            // lowercase: true
        }
    },
    {
        timestamps: true
    }
);

wordSchema.index({word: 1, genre: 1}, {unique: true});

const Word= mongoose.model('Word', wordSchema);

module.exports= Word;