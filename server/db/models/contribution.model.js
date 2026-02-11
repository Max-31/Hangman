const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    contributionType: {
        type: String,
        enum: ['word', 'genre'],
        required: true
    },
    newGenre:{
        // If type='genre', this is the New Genre Name.
        type: String,
        trim: true,
        uppercase: true,
        required: function(){
            return this.contributionType == 'genre';
        }
    },
    linkedGenre:{
        // If type='word', this is the existing genre. 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: function(){
            return this.contributionType == 'word';
        }
    },
    word: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'DENIED'],
        default: 'PENDING'
    },
    adminComment: {
        type: String,
        default: ''
    },
    isReadByPlayer: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

const Contribution = mongoose.model('Contribution', contributionSchema);
module.exports= Contribution;