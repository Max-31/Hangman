import React from 'react'
import { Link } from 'react-router-dom'
import hangGif from '../assets/gifStore/hang-anim.gif'
import './HangAnim.css'
import { useState, useEffect, useRef } from 'react'

const HangAnim = () => {
  const [animText, setAnimText]= useState("PLAY");
  let index= useRef(0);

  useEffect(
    ()=>{

      const intervalID= setInterval(
        ()=>{
          const strAnim= "PLAY";

          const strArr= strAnim.split('');

          strArr[index.current]= '_';

          setAnimText(strArr.join(''));
 
          index.current= (index.current + 1) % 4;
 
        }, 500
      );

      return ()=>clearInterval(intervalID);
    },

    []
  )

  return (
    <div className="hangAnimContainer">
      <h2 className="hangAnimHeading">Welcome to HANGMAN!</h2>
      <img 
        src={hangGif} 
        alt="Hangman Animation" 
        className="hangAnimGif"
      />

      {/* <Link to='/play' className="playLink">{animText}</Link> */}
      <div className="buttonGroup">
        <Link to='/play' className="playLink">{animText}</Link>
        <Link to='/rules' className="rulesLink">RULES <span className="questionMark">?</span></Link>
      </div>
    
    </div>
  )
}

export default HangAnim