import { useEffect, useState, useRef } from 'react';
import './Hangman.css';

const Hangman = ({ attempts }) => {
  const [glow, setGlow] = useState(false);
  const prevAttempts = useRef(attempts);

  useEffect(() => {
    if (attempts < prevAttempts.current) {
      setGlow(true);
      const timeout = setTimeout(() => setGlow(false), 3000);
      return () => clearTimeout(timeout);
    }
    prevAttempts.current = attempts;
  }, [attempts]);

  return (
    <div className={`hangmanContainer ${glow ? 'glow' : ''}`}>
      <div className="heading">
        <h2 className="hangmanTitle">HANGMAN</h2>
      </div>
      
      <div className="sketch">
        {/* Gallows */}
        <div className="gallows">
          <div className="base" />
          <div className="vertical" />
          <div className="horizontal" />
          <div className="rope" />
        </div>

        {/* Stickman */}
        <div className="stickman">
          {attempts <= 5 && <div className="head" />}
          {attempts <= 4 && <div className="body" />}
          {attempts <= 3 && <div className="rightArm" />}
          {attempts <= 2 && <div className="leftArm" />}
          {attempts <= 1 && <div className="rightLeg" />}
          {attempts <= 0 && <div className="leftLeg" />}
        </div>
      </div>
    </div>
  );
};

export default Hangman;