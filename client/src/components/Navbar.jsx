import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleNav= (path)=>{
    setMenuOpen(false);
    // console.log(path);
    navigate(path);
  }

  const handleLogout = async() => {

    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
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

  return (
    <div className="sideNavbar">
      <div className={`navlogo-menu ${menuOpen ? 'logo-menu-active' : ''}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          <ion-icon name="menu-outline"></ion-icon>
        </button>
        
        <h2 className="logo">Hangman</h2>
      </div>

      <ul className={`navList ${menuOpen ? 'active' : ''}`}>
        <li onClick={()=> handleNav('/play')}>
          {/* <Link to="/play">Play</Link> */}
          <div className="navOpt playOpt">Play</div>
        </li>
        <li onClick={()=> handleNav('/leaderboard')}>
          {/* <Link to="/leaderboard">Leaderboard</Link> */}
          <div className="navOpt leaderboardOpt">Leaderboard</div>
        </li>
        <li onClick={()=> handleNav('/profile')}>
          {/* <Link to="/profile">Profile</Link> */}
          <div className="navOpt profileOpt">Profile</div>
        </li>
        <li onClick={()=> handleNav('/rules')}>
          {/* <Link to="/rules">Rules & Tips</Link> */}
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
