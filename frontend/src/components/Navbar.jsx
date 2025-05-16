import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/signUp");
    return;
  };

  return (
    <div className="sideNavbar">
      <h2 className="logo">Hangman</h2>
      <ul className="navList">
        <li>
          <Link to="/play">Play</Link>
          {/* <Link to="/play">
            <PlayChoice hasExistingGame={gameSession} />
            <PlayChoice hasExistingGame={true} />
          </Link> */}
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
