import axios from 'axios'
import './Profile.css'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaGamepad, FaMedal, FaTimes, FaScroll } from 'react-icons/fa';
import Loader from './Loader';

const url= import.meta.env.VITE_API_URL

const Profile = () => {
  const navigate= useNavigate();
  // const userName = localStorage.getItem('userName');
  const userID = localStorage.getItem('userID');
  const [playerName, setPlayerName] = useState('Unknown Player');
  const [guessingPower, setGuessingPower]= useState(0);
  const [wins, setWins]= useState(0);
  const [losses, setLosses]= useState(0);
  const [highScore, setHighScore]= useState(0);

  const [legacyWords, setLegacyWords] = useState([]);

  const [loading, setLoading]= useState(false);

  const loadPlayerData= async()=>{
    setLoading(true);
    try{
      const minLoaderTime = new Promise(resolve => setTimeout(resolve, 1500));

      // const res= await axios.get(`${url}/play/profile/${userID}`);
      const apiRequest= axios.get(`${url}/play/profile/${userID}`);

      const [_, res]= await Promise.all([minLoaderTime, apiRequest]);
      // const player= res.data;
      // console.log(player);

      // Destructure the object { playerData, playerContribution }
      const { playerData, playerContribution } = res.data;

      // Set Stats
      if (playerData) {
        setPlayerName(playerData.userName ?? "Unknown Player");
        setGuessingPower(playerData.guessingPower ?? 0);
        setWins(playerData.wins ?? 0);
        setLosses(playerData.losses ?? 0);
        setHighScore(playerData.highScore ?? 0);
      }

      setLegacyWords(playerContribution ?? []);

      // setPlayerName(player.userName ?? "Unknown Player");
      // setGuessingPower(player.guessingPower ?? 0);
      // setWins(player.wins ?? 0);
      // setLosses(player.losses ?? 0);
      // setHighScore(player.highScore ?? 0);
    }
    catch(err){
      console.log(err.message);
      toast.error("OOPS! Unable to Find Player");
    }
    finally{
      setLoading(false);
    }
  }

  const checkAuth= ()=>{
    const currentUserID= localStorage.getItem("userID");
    if(!currentUserID){
        toast.error("Please login first!");
        navigate('/login');
        return;
    }
  }

  useEffect(()=>{
    checkAuth();
    loadPlayerData();
  },[])

  if(loading){
    return <Loader />
  }

  return (
    <div className="profileContainer">
      <h2 className="profileHeading">Profile</h2>

      <div className="profileBox">
        <div className="profileItem">
          <span className="label">Username:</span>
          {/* <span className="value">{userName}</span> */}
          <span className="value">{playerName}</span>
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

        <div className="profileItem bottom-profile-item">
          <span className="label">Games Lost:</span>
          <span className="value">{losses}</span>
        </div>

        <div>
          <hr/>
        </div>

        {/* --- LEGACY SECTION --- */}
        <div className="contributions-section">
          <h4 className="section-title">
            <FaScroll className="mr-2 inline" /> My Legacy (Contributions)
          </h4>
          
          {legacyWords.length === 0 ? (
            <div className="section-title">
              <p className='genre-tag'>You haven't contributed any approved words yet.</p>
              <button onClick={() => navigate('/contribute')} className="promo-cta-btn">
                Contribute Now
              </button>
            </div>
          ) : (
            <div className="contrib-list">
              {legacyWords.map((item) => (
                <div key={item._id} className="contrib-card">
                  
                  <div className="contrib-date">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}
                  </div>

                  {/* Content (No Badge) */}
                  <div className="contrib-content">
                    <span className="word-text">{item.word.toUpperCase()}</span>
                    <span className="genre-tag">
                      in {item.genre?.name || 'Unknown Genre'}
                    </span>
                  </div>
                 
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default Profile