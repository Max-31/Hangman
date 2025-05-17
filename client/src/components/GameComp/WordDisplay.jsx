import React from 'react';
import './WordDisplay.css';

const WordDisplay = (props) => {
  return (
    <div className="wordDisplayContainer">
      <p className="wordText">{props.word}</p>
    </div>
  )
}

export default WordDisplay;