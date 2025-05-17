import React from 'react'
// import './GameComp/Hangman.css'
import deadmanGif from '../assets/gifStore/Deadman.gif'
import './Deadman.css'

const Deadman = () => {
//   const [glow, setGlow] = useState(false);
    // const prevAttempts = useRef(attempts);
  
    // useEffect(() => {
    //   if (attempts < prevAttempts.current) {
    //     setGlow(true);
    //     const timeout = setTimeout(() => setGlow(false), 3000);
    //     return () => clearTimeout(timeout);
    //   }
    //   prevAttempts.current = attempts;
    // }, [attempts]);
  
    // return (
    //   <div className={`hangmanContainer`}>
    //     <div className="heading">
    //       <h2 className="hangmanTitle">HANGMAN</h2>
    //     </div>
        
    //     <div className="sketch">
    //       {/* Gallows */}
    //       <div className="gallows">
    //         <div className="base" />
    //         <div className="vertical" />
    //         <div className="horizontal" />
    //         <div className="rope" />
    //       </div>
  
    //       {/* Stickman */}
    //       <div className="stickman">
    //         <div className="head" />
    //         <div className="body" />
    //         <div className="rightArm" />
    //         <div className="leftArm" />
    //         <div className="rightLeg" />
    //         <div className="leftLeg" />
    //         <div className="leftLeg"/>
    //       </div>
    //     </div>
    //   </div>
    // )

    return (
      <div className='deadOverlay'>
        <div className="deadPopup deadGlow">
          {/* I want to attach a gif here */}
          <img 
            // src="/assets/gifStore/Deadman.gif"  // 👈 Update this path as needed
            src={deadmanGif}  // 👈 Update this path as needed
            alt="Deadman Animation"
            className="deadGif"
          />
        </div>
      </div>
    )
}

export default Deadman