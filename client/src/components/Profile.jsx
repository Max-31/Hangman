import axios from 'axios'
import './Profile.css'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const url= import.meta.env.VITE_API_URL

const Profile = () => {
  const userName = localStorage.getItem('userName');
  const [guessingPower, setGuessingPower]= useState(0);
  const [wins, setWins]= useState(0);
  const [losses, setLosses]= useState(0);
  const [highScore, setHighScore]= useState(0);

  const loadPlayerData= async()=>{
    try{
      const res= await axios.get(`${url}/play/profile/${userName}`);
      const player= res.data;
      // console.log(player);

      setGuessingPower(player.guessingPower ?? 0);
      setWins(player.wins ?? 0);
      setLosses(player.losses ?? 0);
      setHighScore(player.highScore ?? 0);
    }
    catch(err){
      console.log(err.message);
      toast.error("OOPS! Unable to Find Player");
    }
  }

  useEffect(()=>{
    loadPlayerData();
  },[])

  return (
    <div className="profileContainer">
      <h2 className="profileHeading">Profile</h2>

      <div className="profileBox">
        <div className="profileItem">
          <span className="label">Username:</span>
          <span className="value">{userName}</span>
        </div>

        <div className="profileItem">
          <span className="label">HighScore:</span>
          <span className="value">{highScore}</span>
        </div>

        <div className="profileItem">
          <span className="label">Guessing Power:</span>
          <span className="value">{guessingPower}</span>
        </div>

        <div className="profileItem">
          <span className="label">Games Won:</span>
          <span className="value">{wins}</span>
        </div>

        <div className="profileItem">
          <span className="label">Games Lost:</span>
          <span className="value">{losses}</span>
        </div>
        
      </div>
    </div>
  )
}

export default Profile