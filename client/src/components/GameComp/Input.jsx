import React from 'react'
import './Input.css'
import { useForm } from 'react-hook-form'

const Input = (props) => {
  const {
    register: registerLetter,
    handleSubmit: handleSubmitLetter,
    formState: { errors: errorsLetter },
    reset: resetLetter,
  } = useForm({ mode: 'onSubmit' })
  
  const {
    register: registerWord,
    handleSubmit: handleSubmitWord,
    formState: { errors: errorsWord },
    reset: resetWord,
  } = useForm({ mode: 'onSubmit' })

  const onSubmitLetter= (data)=>{
    props.handleLetter(data);
    resetLetter();
  }

  const onSubmitWord= (data)=>{
    props.handleWord(data);
    resetWord();
  }

  return (
    <div className='inputContainer'>
      <form className="inputForm top" onSubmit={handleSubmitLetter(onSubmitLetter)}>
        <input 
          type="text" 
          className="textInput"
          placeholder='Enter Letter'
          {...registerLetter("letter",
            {
              required: true,
              maxLength: 1
            }
          )}
        />
        {errorsLetter.letter && <p className="errorText">You can Only Guess ONE Letter at a Time</p>}
        <button className="submitButton" type="submit">Check</button>
      </form>

      <form className="inputForm" onSubmit={handleSubmitWord(onSubmitWord)}>
        <input 
          type="text" 
          className="textInput"
          placeholder='Enter Word'
          {...registerWord("word",
            {
              required: true
            }
          )}
        />
        {errorsWord.word && <p className="errorText">Can't guess Blank Words</p>}
        <button className="submitButton" type="submit">Check</button>
      </form>
    </div>
  )
}

export default Input