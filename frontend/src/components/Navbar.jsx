import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/signUp");
    return;
  };

  return (
    <div className="sideNavbar">
      <div className={`navlogo-menu ${menuOpen ? 'logo-menu-active' : ''}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          <ion-icon name="menu-outline"></ion-icon>
        </button>
        
        <h2 className="logo">Hangman</h2>
      </div>

      {/* <ul className="navList"> */}
      <ul className={`navList ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/play">Play</Link>
        </li>
        <li>
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/rules">Rules & Tips</Link>
        </li>
        <li onClick={handleLogout} className="logoutBtn">
          LogOut
        </li>
      </ul>

      
    </div>
  );
};

export default Navbar;



// import React, { useState } from 'react';
// import './Navbar.css';

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => setMenuOpen(prev => !prev);

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">Hangman</div>

//       <button className="menu-toggle" onClick={toggleMenu}>
//         ☰
//       </button>

//       <ul className={`navList ${menuOpen ? 'active' : ''}`}>
//         <li><a href="/">Home</a></li>
//         <li><a href="/rules">Rules</a></li>
//         <li><a href="/play">Play</a></li>
//         <li><a href="/profile">Profile</a></li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
