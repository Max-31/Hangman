require('dotenv').config();
const mongoose = require('mongoose');

const Genre = require('./db/models/genre.model');
const Word = require('./db/models/word.model');
const wordList = require('./words/word');

// ---Genres---
const genreNames = [
    "FRUITS",                   // 0
    "ANIMALS",                  // 1
    "PLACES",                   // 2
    "Random(HARD)"              // 3
];

const rawWordsData = wordList;

// const rawWordsData = [
//     // fruits- 0
//     ["apple", "banana", "orange", "grape", "mango", "pineapple", "watermelon", "strawberry", "cherry", "papaya", "guava", "lemon", "pear", "peach", "plum", "kiwi", "pomegranate", "coconut", "blueberry", "blackberry", "lichi", "apricot", "fig", "melon"],
//     // animals- 1
//     ["dog", "cat", "cow", "goat", "lion", "tiger", "elephant", "monkey", "zebra", "giraffe", "rabbit", "horse", "pig", "sheep", "bear", "deer", "fox", "duck", "hen", "frog", "panda", "kangaroo", "mouse", "snake"],
//     // places- 2
//     ["India", "Paris", "London", "Tokyo", "America", "China", "Egypt", "Brazil", "Canada", "Sydney", "Dubai", "Rome", "Berlin", "Delhi", "Agra", "Venice"],
//     // Common Objects & Actions / random- 3
//     ["water", "light", "clock", "shirt", "shoes", "train", "car", "road", "cloud", "baby", "sleep", "smile", "jump", "game", "dance", "music"],
// ];

// ---helper for pre-computation of wordMap and wordPost---
const calculateWordStats = (word) => {
    const wordMap = {};
    const wordPos = {};
    
    for (let i = 0; i < word.length; i++) {
        const char = word[i];

        if (!wordPos[char]) {
            wordPos[char] = [];
        }

        wordPos[char].push(i);
        wordMap[char] = (wordMap[char] || 0) + 1;
    }

    return { wordMap, wordPos };
};

// ---Seeder Func---
const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected for Seeding...");

        // Del Prev
        console.log("Cleaning old data...");
        await Genre.deleteMany({});
        await Word.deleteMany({});
        
        console.log("Creating Genres...");
        const createdGenres = [];
        
        // inserting in the order as it was in word.js
        for (const name of genreNames) {
            const newGenre = await Genre.create({ name }); 
            createdGenres.push(newGenre);
        }
        console.log(`   -> Created ${createdGenres.length} Genres.`);

        // Words linking to Genres
        console.log("Processing and Inserting Words...");
        
        const wordsToInsert = [];

        rawWordsData.forEach((categoryList, index) => {
            const genreId = createdGenres[index]._id; 

            categoryList.forEach((rawWord) => {
                const finalWord = rawWord.toLowerCase().trim();
                
                const {wordMap, wordPos} = calculateWordStats(finalWord);

                wordsToInsert.push({
                    word: finalWord,
                    genre: genreId,
                    wordMap: wordMap,
                    wordPos: wordPos,
                    contributor: null // Computer gen
                });
            });
        });

        // Bulk Insert -> This is better than My One by One approach
        const result = await Word.insertMany(wordsToInsert);
        console.log(`   -> Successfully inserted ${result.length} Words!`);

        console.log("SEEDING COMPLETE!");
        process.exit(0);

    } catch (error) {
        console.error("Seeding Failed:", error);
        process.exit(1);
    }
};

// Run the function
seedDatabase();