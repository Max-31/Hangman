import './Lost.css'
import { useNavigate } from 'react-router-dom'
import ContributionPromo from './ContributionPromo';

const Lost = ({ word }) => {
  const navigate= useNavigate();

  const showWord= word.toUpperCase();

  const onPlayAgain = () => {
    navigate('/play');
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

      <ContributionPromo storeSession={true}/>

    </div>
  )
}

export default Lost
