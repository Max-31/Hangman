// {gameWon && <Win onClose={resetGame} score={playerScore} />}

import React from 'react'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
import './Win.css'
// import useSound from 'use-sound'

// sound file
// import winSound from '../assets/sounds/win.mp3'

const Win = ({ highScore }) => {
  const navigate= useNavigate();
  // const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  // const [playWin] = useSound(winSound)

  // useEffect(() => {
    // Trigger sound when component mounts
    // playWin()

    // Handle dynamic resizing
    // const handleResize = () => {
    //   setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    // }
    // window.addEventListener('resize', handleResize)

    // return () => window.removeEventListener('resize', handleResize)
  // }, [playWin])

  const onPlayAgain = () => {
    navigate('/temp'); // Dummy route
    setTimeout(() => {
      navigate('/play');
    }, 100); // Small delay to force remount
  };

  return (
    <>
      {/* <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={300} recycle={false} /> */}
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
            // <p className="scoreMsg">Your Score: <span>{highScore}</span></p>
            <p className="scoreMsg">NEW HIGHSCORE!</p>
          }
          <button className="closeBtn" onClick={onPlayAgain}>Play Again</button>
        </div>
      </div>
    </>
  )
}

export default Win