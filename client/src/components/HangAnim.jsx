import React from 'react'
import hangGif from '../assets/gifStore/hang-anim.gif'
import './HangAnim.css'

const HangAnim = () => {
  return (
    <div className="hangAnimContainer">
      <h2 className="hangAnimHeading">Welcome to HANGMAN!</h2>
      <img 
        src={hangGif} 
        alt="Hangman Animation" 
        className="hangAnimGif"
      />
    </div>
  )
}

export default HangAnim
