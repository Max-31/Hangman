import React from 'react';
import './Game.css';
import WordDisplay from './GameComp/WordDisplay';
import Input from './GameComp/Input';
import Hangman from './GameComp/Hangman';
import Win from './Win'
import Deadman from './Deadman'
import Lost from './Lost'
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const url= import.meta.env.VITE_API_URL;

const Game = () => {
  const navigate= useNavigate();
  const location= useLocation();
  // const [gameInfo, setGameInfo]= useState({});
  // const [gameSession, setGameSession]= useState(false);
  const [genre, setGenre]= useState("Loading...");
  const [displayWord, setDisplayWord]= useState('Loading...');
  const [attempt, setAttempt]= useState(6);
  const [isOver, setIsOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [highScore, setHighScore] = useState(false);
  const [realWord, setRealWord]= useState(undefined);
  const [showDeadman, setShowDeadman]= useState(false);

  // const [newStart, setNewStart]= useState(true);
  // const [isLetter, setIsLetter]= useState(true);
  
  const gameInfo= location.state?.gameInfo;
  const isNewGame= location.state?.isNewGame;

  const checkAuth= ()=>{
    const userName= localStorage.getItem("userName");
    if(!userName){
        toast.error("Please login first!");
        navigate('/login');
        return;
    }
  }

  const checkData= ()=>{
    if(!gameInfo){
      toast.error("No game session found!");
      navigate('/play');
      return;
    }
  }

  const loadData = ()=>{
    try{
      if(isNewGame){
        //res-> genre, hiddenWord, message: "New Game is ON!"
        toast.success(gameInfo.message);
        setGenre(gameInfo.genre);
        setDisplayWord(gameInfo.hiddenWord);
      }
      else{
        //res-> existingGame: true, genre, hiddenWord: isGame.hiddenWord, attemptLeft, message: 'Resuming existing game!'
        if(!gameInfo.existingGame){
          toast.error(gameInfo.message);
          navigate('/play');
          return;
        }

        setGenre(gameInfo.genre);
        setAttempt(gameInfo.attemptLeft);
        setDisplayWord(gameInfo.hiddenWord);
        toast.success(gameInfo.message);
      }
    }
    catch(err){
      console.log("error in loadData()");
      console.log(err.message);
      const errMsg= err.response?.data?.message || "Issue in Loading Game Data";
      toast.error("OOPS! " + errMsg);
    }
  }

  useEffect(
    ()=>{
      checkAuth()
      checkData()
      loadData()
    },
    []
  )

  useEffect(
    ()=>{
      if(isOver && !isWin){
        setShowDeadman(true);
        const timer= setTimeout(
          ()=>{
            setShowDeadman(false);
          },
          // 5000
          1840
        );
        return ()=> clearTimeout(timer);
      }
    },
    [isOver, isWin]
  )

    const handleWord= async(data)=>{
      try{
        const userName= localStorage.getItem("userName");
        const res= await axios.put(`${url}/play/guess`,
          {
            userName,
            isWord: true,
            guessedWord: data.word
          }
        )
        const gameDetails= res.data;
        // setGameInfo(gameDetails);

        if(gameDetails.playerFound){
          if(gameDetails.isOver){
            setIsOver(true);
            setIsWin(gameDetails.isWin);
            setHighScore(gameDetails.isHighScore);
            setRealWord(gameDetails.word);
            // if(gameDetails.isWin){        
            //   return(
            //     <Win highScore={gameDetails.isHighScore}/>
            //   )
            // }
            // else{
            //   return(
            //     <Lost />
            //   )
            // }
          }
          else{
            toast.error(`"OOPS! ${data.word}" is NOT the Word!`);
            setAttempt(gameDetails.attemptLeft);
            
            // if(!gameInfo.guessSuccess){
            //   setAttempt(gameInfo.attemptLeft);
            // }
          }
        }
        else{
          toast.error(`OOPS! PLAYER NOT FOUND!`);
          navigate('/play');
          return;
        }

        // if(isOver){
        //   return isWin ? <Win highScore={gameDetails.isHighScore}/> : <Lost />;
        // }        
      }
      catch(err){
        // toast.error(`OOPS! ${err}`);
        console.log("Error in handleWord(): "+ err);
        const errMsg= err.response?.data?.message || "Issue in Word Checking";
        toast.error("OOPS! " + errMsg);
      }
    }

    const handleLetter= async(data)=>{
      try{
        const userName= localStorage.getItem("userName");
        const res= await axios.put(`${url}/play/guess`,
          {
            userName,
            isWord: false,
            Letter: data.letter
          }
        )

        const gameDetails= res.data;
        // setGameInfo(gameDetails);

        if(gameDetails.playerFound){
          if(res.status === 200){
            if(gameDetails.isOver){
              setIsOver(true);
              setIsWin(gameDetails.isWin);
              setHighScore(gameDetails.isHighScore);
              setRealWord(gameDetails.word);
              // if(gameDetails.isWin){
              //   return(
              //     <Win highScore={gameDetails.isHighScore}/>
              //   )
              // }
              // else{
              //   return(
              //     <Lost />
              //   )
              // }
            }
            else{            
              if(!gameDetails.guessSuccess){
                toast.error(`"OOPS! ${data.letter}" is NOT present!`)
                setAttempt(gameDetails.attemptLeft);
              }
              else{
                toast.success(`"${data.letter}" is present!`)
                setDisplayWord(gameDetails.newHiddenWord);
              }
            }
          }
          else{
            toast.error(`${gameDetails.message}`)
          }

          
        }
        else{
          toast.error(`OOPS! PLAYER NOT FOUND!`);
          navigate('/play');
        }

        // if(isOver){
        //   return isWin ? <Win highScore={gameDetails.isHighScore}/> : <Lost />;
        // }  
      }
      catch(err){
        // toast.error(`OOPS! ${err}`);
        console.log("Error in handleWord(): "+ err);
        const errMsg= err.response?.data?.message || "Issue in Letter Checking";
        toast.error("OOPS! " + errMsg);
      }
    }

  if (isOver) {
    // console.log("HS: "+ highScore)
    // return isWin ? <Win highScore={highScore} /> : <Lost word={realWord}/>;
    if(isWin){
      return (
        <Win highScore={highScore}/>
      )
    }

    if(showDeadman){
      return (
        <Deadman />
      )
    }
    
    return(
      <Lost word={realWord}/>
    )
  }    

  return (
    <div className="gameContainer">
      
      {/* Word display at top */}
      <div className="wordDisplay">
        <WordDisplay word={displayWord}/>
      </div>

      <div className="genre-attempts">
        <div className='genre'>
          {/* <h5>GENRE: {genre} | ATTEMPTS LEFT: {attempt}</h5> */}
          <h5>GENRE: {genre}</h5> 
        </div>
        <div className="attempts">
          <h5>ATTEMPTS LEFT: {attempt}</h5>
        </div>
      </div>

      {/* Flex container for Hangman and Input side by side */}
      <div className="gameFlex">
        <div className="hangman">
          <Hangman attempts= {attempt}/>
        </div>
        <div className="inputBoxes">
          <Input handleLetter={handleLetter} handleWord={handleWord}/>
        </div>
      </div>

    </div>
  )
}

export default Game;