import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const userID = localStorage.getItem('userID');
  const url= import.meta.env.VITE_API_URL;

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleNav= (path)=>{
    setMenuOpen(false);
    // console.log(path);
    navigate(path);
  }

  const handleLogout = async() => {

    try{
      await axios.post(`${url}/auth/logout`);
      localStorage.removeItem("userName");
      localStorage.removeItem("userID");
      localStorage.removeItem("role");
      setMenuOpen(false);
    }
    catch(err){
      console.log(err.message);
    }
    finally{
      navigate("/login");
    }
  };

  const fetchNotifications = async()=>{
    if(!userID) return;

    try{
      const res = await axios.get(`${url}/contribution/notifications/${userID}`);
      setNotifCount(res.data.count);
    }
    catch(err){
      console.log("Badge fetch error");
    }
  }

  // This func of mine will be called on-mount
  useEffect(
    ()=>{
      fetchNotifications();

      const handleRefreshSignal = () => {
        console.log("Navbar received refresh signal...");
        fetchNotifications(); 
      };

      window.addEventListener("triggerNavbarRefresh", handleRefreshSignal);

      return () => {
        window.removeEventListener("triggerNavbarRefresh", handleRefreshSignal);
      };

      // const interval = setInterval(fetchNotifications, 60000);
      // const interval = setInterval(
      //   ()=>{
      //     if(document.visibilityState === 'visible'){
      //       fetchNotifications();
      //     }
      //   }, 60000
      // )
      // return ()=> clearInterval(interval);
    }, []
  )

  return (
    <div className="sideNavbar">
      <div className={`navlogo-menu ${menuOpen ? 'logo-menu-active' : ''}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          <ion-icon name="menu-outline"></ion-icon>
          {
            (notifCount>0)&&(
              <span className="menu-notification">{notifCount}</span>
            )
          }
        </button>
        
        <h2 className="logo">Hangman</h2>
      </div>

      <ul className={`navList ${menuOpen ? 'active' : ''}`}>
        <li onClick={()=> handleNav('/play')}>
          <div className="navOpt playOpt">Play</div>
        </li>
        <li onClick={()=> handleNav('/leaderboard')}>
          <div className="navOpt leaderboardOpt">Leaderboard</div>
        </li>
        <li onClick={()=> handleNav('/contribute')} className="nav-item-container">
          <div className="navOpt">
            Contribute Word
          </div>
          {
            (notifCount>0)&&(
              <span className="notification-badge">{notifCount}</span>
            )
          }
          
        </li>
        <li onClick={()=> handleNav('/profile')}>
          <div className="navOpt profileOpt">Profile</div>
        </li>
        <li onClick={()=> handleNav('/rules')}>
          <div className="navOpt rulesTipsOpt">Rules & Tips</div>
        </li>
        <li onClick={handleLogout} className="logoutBtn">
          LogOut
        </li>
      </ul>

      
    </div>
  );
};

export default Navbar;
