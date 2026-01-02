import React from 'react';
import './GameChoice.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const url= import.meta.env.VITE_API_URL;

const GameChoice = () => {
  const navigate= useNavigate();
  // const [continueBtn, setContinue]= useState(true); -> I have seen that the button keeps flickering
  const [continueBtn, setContinue]= useState(false); // No more Flickering

  const userID= localStorage.getItem("userID");

  const checkAuth= ()=>{
    try{
      if(!userID){
        toast.error("Please login first!");
        navigate("/login");
        return;
      }
    }
    catch(err){
      console.log("Error in checkAuth()");
      console.log(err);
      const errMsg= err.response?.data?.message || "Issue in Auth Checking";
      toast.error("OOPS! " + errMsg);
    }
  }

  const checkGameSession= async()=>{
    try{
      if(!userID) return;

      const response= await axios.get(`${url}/play/session/${userID}`);
      const res= response.data;

      setContinue(res.gameSession);
    }
    catch(err){
      console.log("Error in checkGameSession()");
      console.log(err);
      const errMsg= err.response?.data?.message || "Issue in Checking Game Session";
      toast.error("OOPS! " + errMsg);
    }
  }

  useEffect(
    ()=>{
      checkAuth();
      checkGameSession();
    },
    []
  )

  const loadNewGame= async()=>{
    try{

      const response= await axios.post(`${url}/play/newGame`, {userID});
      const res= response.data;

      navigate('/game', {
        state: {
          isNewGame: true,
          gameInfo: res
        }
      })
    }
    catch(err){
      toast.error("ERROR Loading New Game!");
      console.log(err.message);
    }
  }

  const loadContinue= async()=>{
    try{
      const response= await axios.post(`${url}/play/continue`, {userID});
      const res= response.data;

      navigate('/game', {
        state: {
          isNewGame: false,
          gameInfo: res
        }
      })
    }
    catch(err){
      toast.error("ERROR Loading Continue Game!");
      console.log(err.message);
    }
  }

  return (
    <div className= "game-choice-container">
      <button className="game-button new-game" onClick={loadNewGame}>New Game</button>
      {
        continueBtn && <button className="game-button continue-game" onClick={loadContinue}>Continue</button>
      }
    </div>
  )
}

export default GameChoice