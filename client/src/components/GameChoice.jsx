import React from 'react';
import './GameChoice.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const url= import.meta.env.VITE_API_URL;

const GameChoice = () => {
  const navigate= useNavigate();
  // const [continueBtn, setContinue]= useState(true); -> I have seen that the button keeps flickering
  const [continueBtn, setContinue]= useState(false); // No more Flickering

  const userID= localStorage.getItem("userID");
  const [loading, setLoading]= useState(false);

  const checkAuth= ()=>{
    
    try{
      if(!userID){
        toast.error("Please login first!");
        navigate("/login");
        return;
      }
    }
    catch(err){
      const errMsg= err.response?.data?.message || "Issue in Auth Checking";
      console.log("Error in checkAuth()");
      console.log(err);
      console.log(errMsg);
      toast.error("OOPS! Internal Error");
    }
  }

  const checkGameSession= async()=>{
    setLoading(true);
    try{
      if(!userID) return;

      const minLoaderTime = new Promise(resolve => setTimeout(resolve, 1500));

      // const response= axios.get(`${url}/play/session/${userID}`);
      const apiRequest= axios.get(`${url}/play/session/${userID}`);

      const [_, response]= await Promise.all([minLoaderTime, apiRequest]);
      
      const res= response.data;

      setContinue(res.gameSession);
    }
    catch(err){

      console.log("Error in checkGameSession()");

      if (err.response && err.response.status === 401) {
        toast.error("Session Expired. Please Login again.");
        navigate('/login');
        return;
      }

      const errMsg= err.response?.data?.message || "Issue in Checking Game Session";
      console.log(err);
      console.log(errMsg);
      toast.error("OOPS! Internal Error");
    }
    finally{
      setLoading(false);
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
    setLoading(true);
    try{

      const minLoaderTime = new Promise(resolve => setTimeout(resolve, 1500));

      // const response= await axios.post(`${url}/play/newGame`, {userID});
      const apiRequest= axios.post(`${url}/play/newGame`, {userID});

      const [_, response]= await Promise.all([minLoaderTime, apiRequest]);

      const res= response.data;

      navigate('/game', {
        state: {
          isNewGame: true,
          gameInfo: res
        }
      })
    }
    catch(err){
      if (err.response && err.response.status === 401) {
        toast.error("Session Expired. Please Login again.");
        navigate('/login');
        return;
      }

      toast.error("ERROR Loading New Game!");
      console.log(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  const loadContinue= async()=>{
    setLoading(true);
    try{

      const minLoaderTime = new Promise(resolve => setTimeout(resolve, 1500));

      // const response= await axios.post(`${url}/play/continue`, {userID});
      const apiRequest= axios.post(`${url}/play/continue`, {userID});

      const [_, response]= await Promise.all([minLoaderTime, apiRequest]);

      const res= response.data;

      navigate('/game', {
        state: {
          isNewGame: false,
          gameInfo: res
        }
      })
    }
    catch(err){
      if (err.response && err.response.status === 401) {
        toast.error("Session Expired. Please Login again.");
        navigate('/login');
        return;
      }

      toast.error("ERROR Loading Continue Game!");
      console.log(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  if(loading){
    return <Loader />
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