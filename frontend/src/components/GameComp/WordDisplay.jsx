import React from 'react';
import './WordDisplay.css';

// func add korbo jeta word dekhabe hiddenWord --> props e send kore debo

const WordDisplay = (props) => {
  return (
    <div className="wordDisplayContainer">
      <p className="wordText">{props.word}</p>
    </div>
  )
}

export default WordDisplay;