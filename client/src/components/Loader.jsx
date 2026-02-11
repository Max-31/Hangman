import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="hangman-loader">
        {/* The Gallows Structure */}
        <div className="pole-vertical"></div>
        <div className="pole-top"></div>
        <div className="rope"></div>
        
        {/* The Swinging Noose */}
        <div className="noose-swing">
            <div className="noose-circle"></div>
        </div>
        
        {/* Optional: Text */}
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;