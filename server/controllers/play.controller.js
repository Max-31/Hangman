const Player= require('../db/models/player.model');
const Game= require('../db/models/game.model');
const Word= require('../words/word');
// const axios= require('axios');
// const randomWords= require('random-words');
// import { generate } from 'random-words';
// const randomWords = await import('random-words');

const profile= async(req, res)=>{
    try{
        const userName= req.params.userName;

        const playerData= await Player.findOne({userName}).select("userName wins guessingPower losses highScore");
        
        return res.status(200).json(playerData);
    }
    catch(err){
        return res.status(500).json({message: "Unable to get Players!"});
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

const newHighScore= (guessPow, isPlayer)=>{
    // if (isPlayer.guessingPower == null) return true;
    return guessPow > isPlayer.highScore;
}

const newGame= async(req, res)=>{
    try{
        const {userName}= req.body;
        
        const isGame= await Game.findOne({userName});
        
        if(isGame){

            gameOver(isGame._id);

            // const attemptLeft= isGame.remainingAttempts;
            // console.log(attemptLeft);
            // return res.status(200).json({
            //     active: true,
            //     hiddenWord: isGame.hiddenWord,
            //     attemptLeft,
            //     message: 'Resuming existing game!'
            // });
        }
        
        // const word= await generateWord();
        
        const objWord= generateWord();
        const word= objWord.word;
        const genre= objWord.genre;
        // console.log(word);

        const wordMap= {};
        const wordPos= {};
        for(let i=0; i<word.length; i++){
            const char= word[i];

            if(!wordPos[char]){
                wordPos[char]= [];
            }

            wordPos[char].push(i);

            wordMap[char]= (wordMap[char] || 0 ) + 1;
        }

    //NOOB WAY:
        // const hiddenWord= "";
        // for(let i=0; i<word.length; i++){
        //     if(i === word.length - 1){
        //         hiddenWord+= "_"
        //     }
        //     else{
        //         hiddenWord+= "_ ";
        //     }
        // }

    //PRO WAY:
        const hiddenWord = word.split('').map(() => "_").join(" ");

        const newGameSession= new Game({
            userName,
            word, 
            wordMap, 
            wordPos,
            hiddenWord,
            genre
        });
        await newGameSession.save();

        return res.status(200).json({ 
            // active: false,
            genre,
            hiddenWord, 
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
        const {userName}= req.body;
        
        const isGame= await Game.findOne({userName});
        
        if(isGame){
            const attemptLeft= isGame.remainingAttempts;
            const genre= isGame.genre;
            // console.log(attemptLeft);
            return res.status(200).json({
                existingGame: true,
                genre,
                hiddenWord: isGame.hiddenWord,
                attemptLeft,
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

const generateWord= ()=>{
//method-1: cholena eta properly always
    // const word= randomWords.generate();

//method-2: onk tough words dey 
    // const res= await axios.get('https://random-word-api.herokuapp.com/word');
    // const word= res.data[0];
    // return word.toLowerCase();

//method-3: manual list:
    //choose i and j randomly
    const i = Math.floor(Math.random() * Word.length);        
    const j = Math.floor(Math.random() * Word[i].length);     
    
    //word= Word[i,j]
    //return word.toLowerCase();
    const word = Word[i][j].toLowerCase();
    // console.log(word);
    
    let genre= "Fruit";
    if(i === 1) genre= "Animal";
    else if(i === 2) genre= "Place";
    else if(i === 3) genre= "Common Objects & Actions";

    const objWord= {word, genre};

    return objWord;
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

const manageAttempt = async (res, isGame) => {
    try{
        const remAttempts = isGame.remainingAttempts - 1;
    
        if (!isRemAttempts(remAttempts)) {
            const word= isGame.word;
    
            await saveLoss(isGame);
    
            gameOver(isGame._id);
            return res.status(200).json({
                playerFound: true,
                isOver: true,
                isWin: false,
                word,
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
        const userName= isGame.userName;
        const attemptLeft= isGame.remainingAttempts;

        const isPlayer= await Player.findOne({userName});
        
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
        const userName= isGame.userName;

        const isPlayer= await Player.findOne({userName});
        
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

const checkWord = async(req, res, isGame) => {
    // const { guessedWord } = req.body;
    const guessedWord = req.body.guessedWord?.trim().toLowerCase();

    if (isGame.word === guessedWord) {
        const word= isGame.word;
        
        const highScore= await saveWin(isGame);
        // console.log(highScore)
        await gameOver(isGame._id);
        if(highScore){
            return res.status(200).json({
                playerFound: true,
                isOver: true,
                isWin: true,
                isHighScore: true,
                message: "You guessed all the letters correctly!",
                word,
                guessSuccess: true
            });
        }

        return res.status(200).json({
            playerFound: true,
            isOver: true,
            isWin: true,
            isHighScore: false,
            message: "You guessed all the letters correctly!",
            word,
            guessSuccess: true
        });
    } else {
        return await manageAttempt(res, isGame);
    }
}

const checkLetter= async(req, res, isGame)=>{
    // const {Letter}= req.body;
    const Letter= req.body.Letter?.trim();

    if (Letter.length !== 1) {
        return res.status(400).json({ message: "Invalid letter input." });
    }

    const LetterLow= Letter.toLowerCase();

    if (isGame.guessLetters.includes(LetterLow)) {
        // return res.status(409).json({ message: "You already guessed this letter." });
        const attemptLeft= isGame.remainingAttempts;
        // console.log(attemptLeft);
        return res.status(200).json({
            playerFound: true,
            isOver: false,
            guessSuccess: false,
            alreadyGuessed: true,
            attemptLeft,
            message: `You already guessed "${LetterLow}".`
        });
    }
    isGame.guessLetters.push(LetterLow);    

    const isPresent= LetterLow in isGame.wordMap;
    if(!isPresent){
        return await manageAttempt(res, isGame);
    }

    const posList= isGame.wordPos[LetterLow];
    let newHiddenWord = isGame.hiddenWord.split('');  // Convert to array for easy update

    for (let i of posList) {
        newHiddenWord[2 * i] = LetterLow; // 2*i to handle spaces between underscores
    }

    isGame.hiddenWord = newHiddenWord.join(''); // Convert back to string
    await isGame.save();

    //if all letters guessed (remove spaces for comparison)
    const cleanedHidden = isGame.hiddenWord.replace(/\s/g, '');
    if (cleanedHidden === isGame.word) {
        await gameOver(isGame._id);

        const highScore= await saveWin(isGame);
        if(highScore){
            return res.status(200).json({
                playerFound: true,
                isOver: true,
                isWin: true,
                isHighScore: true,
                word: isGame.hiddenWord,
                message: "You guessed all the letters correctly!"
            });
        }

        return res.status(200).json({
            playerFound: true,
            isOver: true,
            isWin: true,
            isHighScore: false,
            word: isGame.hiddenWord,
            message: "You guessed all the letters correctly!"
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
        const {userName, isWord}= req.body;

        const isGame= await Game.findOne({userName});

        if(!isGame){
            return res.status(404).json({
                playerFound: false,
                message: "No Active Game found! Start a New Game"
            })
        }

        if(isWord){
            return await checkWord(req, res, isGame);
        }
        else{
            return await checkLetter(req, res, isGame);
        }
    }
    catch(err){
        console.log("Error in Guess");
        return res.status(500).json({message: "Unexpected Error!"});
    }
}

const endGame= async(req,res) => {
    try{
        const {userName}= req.body;
        const isGame= await Game.findOne({userName});
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
        const {userName}= req.params;

        const isGame= await Game.findOne({userName});

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