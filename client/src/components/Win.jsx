import React, { useEffect } from 'react'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
import './Win.css'
import useSound from 'use-sound'

// sound file
import winSound from '../assets/sounds/win.mp3'
import highSound from '../assets/sounds/highSound.mp3'

const Win = ({ highScore }) => {
  const navigate= useNavigate();
  const [playWin] = useSound(winSound);
  const [playHigh] = useSound(highSound);

  useEffect(
    () => {
      // Trigger sound when component mounts
      if(highScore){
        playHigh();
      }
      else{
        playWin();
      }

    }, 
  [playWin, playHigh, highScore])

  const onPlayAgain = () => {
    navigate('/play');
  };

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={1000}
        recycle={false}
      />

      <div className="winOverlay">
        <div className="winPopup winGlow">
          <h2>You Won!</h2>
          <p>Congratulations, you guessed the word correctly!</p>
          {
            highScore !== undefined && highScore &&
            <p className="scoreMsg">NEW HIGHSCORE!</p>
          }
          <button className="closeBtn" onClick={onPlayAgain}>Play Again</button>
        </div>
      </div>
    </>
  )
}

export default Win