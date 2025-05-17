import React from 'react';
import './Rules.css';

const Rules = () => {
  return (
    <div className="rules-container">
      <h2 className="rules-title">Hangman Rules & Tips</h2>
      
      <div className="rules-section">
        <h3>🎯 Objective</h3>
        <p>Guess the hidden word, one letter at a time (or word) within 6 attempts.</p>
      </div>

      <div className="rules-section">
        <h3>📜 Rules</h3>
        <ul>
          <li>The word to guess is represented by a series of underscores (_).</li>
          <li>Guess one letter at a time by typing it in the input box.</li>
          <li>If the letter exists in the word, it will be revealed in its position(s).</li>
          <li>Wrong guesses decrease your remaining attempts and draw a part of the hangman.</li>
          <li>If all attempts are gone i.e., the Entire Hangman is drawn, it's GAME OVER.</li>
          <li>Guess the full word if you're confident - but a wrong guess will cost you an attempt!</li>
          <li>You WIN if you guess the entire word before the hangman is completed (i.e. within 6 attempts i.e., Head, 2 Arms, 1 Body and 2 Legs).</li>
        </ul>
      </div>

      <div className="rules-section">
        <h3>💡 Tips</h3>
        <ul>
          <li>Start with common vowels like A, E, O.</li>
          <li>Then try common consonants: R, S, T, L, N.</li>
          <li>Think about possible word patterns as you reveal more letters.</li>
          <li>Try to deduce as many clues possible from "Genre" displayed.</li>
          <li>Be careful with full word guesses — they're risky!</li>
        </ul>
      </div>
    </div>
  );
};

export default Rules;