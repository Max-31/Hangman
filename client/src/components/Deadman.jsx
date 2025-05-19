import deadmanGif from '../assets/gifStore/Deadman.gif'
import { useEffect } from 'react'
import useSound from 'use-sound'
import lostSound from '../assets/sounds/lostSound.mp3'
import './Deadman.css'

const Deadman = () => {
  const [playLost]= useSound(lostSound);

  useEffect(
    ()=>{
      playLost();
    },
    [playLost]
  )

  return (
    <div className='deadOverlay'>
      <div className="deadPopup deadGlow">
        {/* Attached gif */}
        <img 
          //src="/Deadman.gif"  // can keep it in public
          src={deadmanGif}  
          alt="Deadman Animation"
          className="deadGif"
        />
      </div>
    </div>
  )
}

export default Deadman