import React from 'react'
import './Lost.css'
import { useNavigate } from 'react-router-dom'

const Lost = ({ word }) => {
  const navigate= useNavigate();

  const showWord= word.toUpperCase();

  const onPlayAgain = () => {
    navigate('/temp'); // Dummy route
    setTimeout(() => {
      navigate('/play');
    }, 100); // Small delay to force remount
  };

  return (
    <div className="lostOverlay">
      <div className="lostPopup lostGlow">
        <h2>Game Over 💀</h2>
        <p>Oops! You couldn't guess the word.</p>
        {
          word &&
          <p className="correctWord">The correct word was: <span>{showWord}</span></p>
        }
        <button className="closeBtn" onClick={onPlayAgain}>Try Again</button>
      </div>
    </div>
  )
}

export default Lost
