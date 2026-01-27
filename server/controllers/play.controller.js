const Player= require('../db/models/player.model');
const Game= require('../db/models/game.model');
const Word= require('../db/models/word.model');
// const Word= require('../words/word');

//helper
const generateWord= async()=>{
    // method-4: get it From DB: thus here i can update the Word list from contributor as well

    // // generate random index for me to pic from DB
    // const random= Math.floor(Math.random() * count);
    // //picking from DB-> Fetch one random doc by skipping a random no. of docs
    // const randWordDoc= await Word.findOne().skip(random).populate('genre contributor'); 
    // ------------------- below is the Alternate BETTER version of this -----------------

    const wordCollection = Word.collection;

    // I am using the aggregation pipeline with $sample for efficiency
    const randomDocs = await wordCollection.aggregate([
        { $sample: { size: 1 } }
    ]).toArray();
    
    if (randomDocs.length === 0) {
        console.log("Word collection is empty!");
        return null;
    }
    
    // I am Populating the randomly selected document with genre, contributor for the UI return
    const randWordDoc = await Word.populate(randomDocs[0], { path: 'genre contributor' });

    if (!randWordDoc) {
        console.error("Failed to fetch a random word.");
        return null;
    }

    // I am Returning the whole doc so we have _id and word string
    return randWordDoc;

    // const objWord= {
    //     word: randWordDoc.word,
    //     genre: randWordDoc.genre?.name,
    //     contributor: randWordDoc.contributor?.userName || "Computer"
    // }
    // return objWord;

    //-------------------------------------------------------------------

// method-1: this one doesn't always run properly acc to my needs
    // const word= randomWords.generate();

// method-2: words are a lot Tough 
    // const res= await axios.get('https://random-word-api.herokuapp.com/word');
    // const word= res.data[0];
    // return word.toLowerCase();

// method-3: manual list:
    // // choose i and j randomly
    // const i = Math.floor(Math.random() * Word.length);        
    // const j = Math.floor(Math.random() * Word[i].length);     
    
    // //word= Word[i,j]
    // //return word.toLowerCase();
    // const word = Word[i][j].toLowerCase();

    // // console.log(word);
    
    // let genre= "Fruit";
    // if(i === 1) genre= "Animal";
    // else if(i === 2) genre= "Place";
    // else if(i === 3) genre= "Common Objects & Actions";
}

const newHighScore= (guessPow, isPlayer)=>{
    // if (isPlayer.guessingPower == null) return true;
    return guessPow > isPlayer.highScore;
}

//-------------------------------controllers-------------------------------
const profile= async(req, res)=>{
    try{
        const {userID}= req.params;

        // const playerData= await Player.findOne({userName}).select("userName wins guessingPower losses highScore");
        // now userName from Frontend sends player ID
        const playerData = await Player.findById(userID).select("userName wins guessingPower losses highScore");
        
        return res.status(200).json(playerData);
    }
    catch(err){
        return res.status(500).json({message: "Unable to get Player!"});
    }
}

const leaderboard= async(req, res)=>{
    try{
        const allPlayers= await Player.find({})
                                      .sort({guessingPower: -1, updatedAt: -1})
                                      .limit(10)
                                      .select("userName wins guessingPower");
        
        return res.status(200).json(allPlayers);
    }
    catch(err){
        return res.status(500).json({message: "Unable to get Players!"});
    }
}

const newGame= async(req, res)=>{
    try{
       const {userID}= req.body;
        
        // const isGame= await Game.findOne({userName: userID});
        const isGame= await Game.findOne({userID});
        
        if(isGame){
            gameOver(isGame._id);
        }
        
        // my old func which fetches random word from word.js thus no async await
        // const objWord= generateWord();

        // Now awaits the async function to fetch a random word from the DB
        const randWordDoc = await generateWord();
        
        // no word could be fetched
        if (!randWordDoc) {
            return res.status(500).json({ message: "Could not generate a word from the database." });
        }

        const word= randWordDoc.word.toLowerCase();
        const genre= randWordDoc.genre?.name || "unknown-genre";
        const contributor= randWordDoc.contributor?.userName || "Computer";
        // console.log(word);

    //now I pre-calculate and store it in word.model.js
        // const wordMap= {};
        // const wordPos= {};
        // for(let i=0; i<word.length; i++){
        //     const char= word[i];

        //     if(!wordPos[char]){
        //         wordPos[char]= [];
        //     }

        //     wordPos[char].push(i);

        //     wordMap[char]= (wordMap[char] || 0 ) + 1;
        // }

    // my NOOB WAY:
        // const hiddenWord= "";
        // for(let i=0; i<word.length; i++){
        //     if(i === word.length - 1){
        //         hiddenWord+= "_"
        //     }
        //     else{
        //         hiddenWord+= "_ ";
        //     }
        // }

    // my PRO WAY:
        const hiddenWord = word.split('').map(() => "_").join(" ");

        const newGameSession= new Game({
            userID, //player ID
            word: randWordDoc._id, //word ID
            hiddenWord,
            guessedLetters: [], 
            guessedWords: []

        });
        await newGameSession.save();
        //now we get these by .populater()
            // wordMap, 
            // wordPos,
            // genre,
            // contributor

        return res.status(200).json({
            genre,
            hiddenWord, 
            contributor,
            message: "New Game is ON!"
        });
    }
    catch(err){
        console.log("Error in New Game");
        return res.status(500).json({message: "Unexpected Error Occured"});
    }
}

const continueGame= async(req, res)=>{
    try{
        const {userID}= req.body;
        
        // const isGame= await Game.findOne({userName: userID}).populate({
        const isGame= await Game.findOne({userID}).populate({
            path: 'word',
            populate: {path: 'genre contributor'}
        });
        
        if(isGame){
            // const attemptLeft= isGame.remainingAttempts;
            // const genre= isGame.genre;
            // const contributor= isGame.contributor;
            // console.log(attemptLeft);
            return res.status(200).json({
                existingGame: true,
                genre: isGame.word.genre?.name || "unknown-genre",
                contributor: isGame.word.contributor?.userName || "Computer",
                hiddenWord: isGame.hiddenWord,
                attemptLeft: isGame.remainingAttempts,
                message: 'Resuming existing game!'
            });
        }
        return res.status(400).json({
            existingGame: false,
            message: "No Game to Continue. Start a New Game!"
        })
    }
    catch(err){
        console.log("Error in Continue Game");
        return res.status(500).json({message: "Unexpected Error Occured"});
    }
}

const isRemAttempts= (remainingAttempts)=>{
    if(remainingAttempts === 0){
        return false;
    }
    return true;
} 

const gameOver= async(id)=>{
    try {
        await Game.findByIdAndDelete(id);
    } catch (err) {
        console.error(`Error deleting game with id ${id}:`, err.message);
    }
}

const manageAttempt = async (res, isGame, actualWord) => {
    try{
        const remAttempts = isGame.remainingAttempts - 1;
    
        if (!isRemAttempts(remAttempts)) {
            // const word= isGame.word;
    
            await saveLoss(isGame);
            await gameOver(isGame._id);

            return res.status(200).json({
                playerFound: true,
                isOver: true,
                isWin: false,
                word: actualWord,
                message: "YOU LOST! GAME OVER."
            });
        }
    
        isGame.remainingAttempts = remAttempts;
        await isGame.save();
    
        return res.status(200).json({
            playerFound: true,
            isOver: false,
            guessSuccess: false,
            attemptLeft: remAttempts
        });
    }
    catch(err){
        console.log("error in Manage Attempts");
    }
}

const saveWin= async(isGame)=>{
    try{
        const userID= isGame.userID;
        const attemptLeft= isGame.remainingAttempts;

        const isPlayer= await Player.findById(userID);
        
        const newWin= isPlayer.wins + 1;
        isPlayer.wins= newWin;

        const guessPow= attemptLeft + isPlayer.guessingPower;
        isPlayer.guessingPower= guessPow;

        const isHighScore= newHighScore(guessPow, isPlayer);

        if(isHighScore){
            isPlayer.highScore= guessPow;
            await isPlayer.save();
            return true;
        }
        else{
            await isPlayer.save();
            return false;
        }
    }
    catch(err){
        console.log("error in SaveWin");
    }
}

const saveLoss= async(isGame)=>{
    try{
        const userID= isGame.userID;

        const isPlayer= await Player.findById(userID);
        
        const newLosses= isPlayer.losses + 1;
        isPlayer.losses= newLosses;

        const newGuessPow= isPlayer.guessingPower - 1;
        if(newGuessPow >= 0){
            isPlayer.guessingPower= newGuessPow;
        }

        await isPlayer.save();

    }
    catch(err){
        console.log("error in SaveWin");
    }
}

const checkWord = async(req, res, isGame, actualWord) => {
    // const { guessedWord } = req.body;
    const guessedWord = req.body.guessedWord?.trim().toLowerCase();

    if (actualWord === guessedWord) {
        // const word= isGame.word;
        
        const highScore= await saveWin(isGame);
        // console.log(highScore)
        await gameOver(isGame._id);

        return res.status(200).json({
            playerFound: true,
            isOver: true,
            isWin: true,
            isHighScore: highScore,
            message: "You guessed all the letters correctly!",
            word: actualWord,
            guessSuccess: true
        });

        // if(highScore){
        //     return res.status(200).json({
        //         playerFound: true,
        //         isOver: true,
        //         isWin: true,
        //         isHighScore: true,
        //         message: "You guessed all the letters correctly!",
        //         word,
        //         guessSuccess: true
        //     });
        // }

    } else {
        if(isGame.guessedWords.includes(guessedWord)){
            return res.status(200).json({
                playerFound: true,
                isOver: false,
                guessSuccess: false,
                alreadyGuessed: true,
                attemptLeft: isGame.remainingAttempts,
                message: `You have already guessed "${guessedWord.toUpperCase()}".`
            });
        }
        isGame.guessedWords.push(guessedWord);
        return await manageAttempt(res, isGame, actualWord);
    }
}

const checkLetter= async(req, res, isGame, actualWord)=>{
    // const {Letter}= req.body;
    const Letter= req.body.Letter?.trim();

    if (Letter.length !== 1) {
        return res.status(400).json({ message: "Invalid letter input." });
    }

    const LetterLow= Letter.toLowerCase();

    if (isGame.guessedLetters.includes(LetterLow)) {
        // return res.status(409).json({ message: "You already guessed this letter." });
        // const attemptLeft= isGame.remainingAttempts;
        // console.log(attemptLeft);
        return res.status(200).json({
            playerFound: true,
            isOver: false,
            guessSuccess: false,
            alreadyGuessed: true,
            attemptLeft: isGame.remainingAttempts,
            message: `You have already guessed "${LetterLow.toUpperCase()}".`
        });
    }
    isGame.guessedLetters.push(LetterLow);    

    const wordData = isGame.word;
    if(!wordData.wordMap || !wordData.wordMap[LetterLow]){
        return await manageAttempt(res, isGame, actualWord);
    }
    // const isPresent= LetterLow in isGame.wordMap;
    // if(!isPresent){
    //     return await manageAttempt(res, isGame, actualWord);
    // }

    const posList= wordData.wordPos[LetterLow];
    let newHiddenWord = isGame.hiddenWord.split('');  // Convert to array for easy update

    for (let i of posList) {
        newHiddenWord[2 * i] = LetterLow; // 2*i to handle spaces between underscores
    }

    isGame.hiddenWord = newHiddenWord.join(''); // Convert back to string
    await isGame.save();

    //if all letters guessed (remove spaces for comparison)
    const cleanedHidden = isGame.hiddenWord.replace(/\s/g, '');
    if (cleanedHidden === actualWord) {
        await gameOver(isGame._id);

        const highScore= await saveWin(isGame);
        // if(highScore){
        //     return res.status(200).json({
        //         playerFound: true,
        //         isOver: true,
        //         isWin: true,
        //         isHighScore: highScore,
        //         word: isGame.hiddenWord,
        //         message: "You guessed all the letters correctly!"
        //     });
        // }

        return res.status(200).json({
            playerFound: true,
            isOver: true,
            isWin: true,
            isHighScore: highScore,
            word: isGame.hiddenWord,
            message: "You have guessed all the letters correctly!"
        });
    }

    return res.status(200).json({
        playerFound: true,
        isOver: false,
        guessSuccess: true,
        newHiddenWord: isGame.hiddenWord
    });
}

const processGuess= async(req, res)=>{
    try{
        const {userID, isWord}= req.body;
        // const userID = req.body.userName;
        // const isWord = req.body.isWord;

        const isGame= await Game.findOne({userID}).populate('word');

        if(!isGame){
            return res.status(404).json({
                playerFound: false,
                message: "No Active Game found! Start a New Game"
            })
        }

        const actualWord = isGame.word.word.toLowerCase();
        if(isWord){
            return await checkWord(req, res, isGame, actualWord);
        }
        else{
            return await checkLetter(req, res, isGame, actualWord);
        }
    }
    catch(err){
        console.log("Error in Guess");
        return res.status(500).json({message: "Unexpected Error!"});
    }
}

const endGame= async(req,res) => {
    try{
        const {userID}= req.body;
        const isGame= await Game.findOne({userID});
        if(!isGame){
            return res.status(404).json({message: "No Active Game session found!"});
        }

        gameOver(isGame._id);
        return res.status(200).json({message: "Game Session is Deleted!"})
    }
    catch(err){
        console.log("Error in EndGame");
        return res.status(500).json({message: "Unexpected Error!"});
    }
}

const isSession= async(req, res)=> {
    try{
        const {userID}= req.params;

        // const isGame= await Game.findOne({userName});
        //now userName = player ID
        const isGame = await Game.findOne({userID})

        if(isGame){
            return res.status(200).json({
                gameSession: true
            });
        }
        else{
            return res.status(200).json({
                gameSession: false
            });
        }
    }
    catch(err){
        console.log("Error in isSession()");
        console.log(err);
        return res.status(500).json({message: "Unexpected Error!"});
    }
}

module.exports= {newGame, continueGame, profile, processGuess, leaderboard, endGame, isSession};