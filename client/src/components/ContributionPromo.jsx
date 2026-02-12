import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaPenNib, FaUserAstronaut } from 'react-icons/fa';
import './ContributionPromo.css';

const ContributionPromo = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // I'm Checking if user has already seen/dismissed it this session
    let hasSeen;
    if(props.storeSession){
        hasSeen= sessionStorage.getItem('seenContribPromo');
    }
    else{
        hasSeen= false;
    }
    
    if (!hasSeen) {
      // I'm Showing after 2 seconds for a nice entrance effect
      const timer = setTimeout(() => setIsVisible(true), 2000);
      // const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if(props.storeSession){
        sessionStorage.setItem('seenContribPromo', true);
    }
  };

  const handleGo = () => {
    handleClose();
    navigate('/contribute');
  };

  if (!isVisible) return null;

  return (
    <div className="promo-overlay">
      <div className="promo-modal animate-pop-in">
        <button className="close-btn" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="promo-content">
          <div className="icon-glow">
            <FaPenNib />
          </div>
          
          <h2 className="promo-title">Leave Your Mark!</h2>
          
          <p className="promo-text">
            Did you know? If you add a word, players will see <strong>YOUR NAME</strong> when they solve it!
          </p>

          {/* Visual Simulation of the Game UI */}
          <div className="mock-game-ui">
            {/* <div className="mock-word">P L A N E T</div> */}
            <div className="mock-word">U R A N U S</div>
            <div className="mock-credit">
              <span className="credit-label">Author:</span>
              <span className="credit-name">
                 <FaUserAstronaut className="inline-icon" /> You?
              </span>
            </div>
          </div>

          <button className="promo-cta-btn" onClick={handleGo}>
            Contribute Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributionPromo;