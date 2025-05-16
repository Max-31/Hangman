import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaderboardEachPlayer from "./LeaderboardEachPlayer";
import "./Leaderboard.css";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_API_URL;

const Leaderboard = () => {
  const [players, setPlayers]= useState([]);
  const getLeaderboard= async() =>{
    try{
      const res= await axios.get(`${url}/play/leaderboard`);
      setPlayers(res.data);      
    }
    catch(err){
      console.log("Error in Leaderboard fetching");
      toast.error("OOPS! "+err);
    }
  }

  useEffect(
    ()=>{
      getLeaderboard();
    }, []
  )

  return (
    <div className="leaderboardContainer">
      <h2 className="leaderboardHeading">Leaderboard</h2>

      <div className="leaderboardTable">
        <div className="leaderboardRow leaderboardHeader">
          <div>Rank</div>
          <div>Username</div>
          <div>Wins</div>
          <div>Guessing Power</div>
        </div>

        {/* Sample Data */}
        {/* <div className="leaderboardRow">
          <div>1</div>
          <div>Rajarshi</div>
          <div>15</div>
          <div>2</div>
        </div> */}
        
        {
          players.length === 0
          ?
          <div className="leaderboardHeader">LEADERBOARD is EMPTY</div>
          :
          players.map(
            (player, index)=>(
              <LeaderboardEachPlayer key={player._id} rank= {index+1} userName={player.userName} wins={player.wins} guessingPower={player.guessingPower}/>
            )
          )
        }

        {/* More rows can come dynamically later */}
      </div>
    </div>
  );
};

export default Leaderboard;
