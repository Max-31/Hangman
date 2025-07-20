const mongoose = require('mongoose');
const Word = require('../db/models/word.model'); 
const ogWords = require('../words/word.js'); 

const dbURI = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL;

const categories = [
    "Fruits",
    "Animals",
    "Places",
    "Common Objects & Actions (HARD)"
];

const seedDB = async () => {
    try {
        // 1. Connect DB
        await mongoose.connect(dbURI);
        console.log('MongoDB connected for seeding...');

        // 2. Clear existing words to avoid duplicates on re-running
        await Word.deleteMany({});
        console.log('Existing words collection cleared.');

        // 3. Prepare the array of word docs to be inserted
        const wordsToInsert = [];
        ogWords.forEach((wordArray, index) => {
            const genre = categories[index];
            wordArray.forEach(word => {
                wordsToInsert.push({ 
                    word: word.toLowerCase(), 
                    genre: genre 
                });
            });
        });

        // 4. Insert the new words into the DB
        await Word.insertMany(wordsToInsert);
        console.log(`DB seeded successfully with ${wordsToInsert.length} words!`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // 5. Close the DB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

// Run the seeder function
seedDB();
