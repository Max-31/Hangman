import "./Input.css";
import { useForm } from "react-hook-form";

const Input = (props) => {
  const {
    register: registerLetter,
    handleSubmit: handleSubmitLetter,
    formState: { errors: errorsLetter },
    reset: resetLetter,
  } = useForm({ mode: "onSubmit" });

  const {
    register: registerWord,
    handleSubmit: handleSubmitWord,
    formState: { errors: errorsWord },
    reset: resetWord,
  } = useForm({ mode: "onSubmit" });

  const onSubmitLetter = (data) => {
    props.handleLetter(data);
    resetLetter();
  };

  const onSubmitWord = (data) => {
    props.handleWord(data);
    resetWord();
  };

  return (
    <div className="inputContainer">
      <form
        className="inputForm top"
        onSubmit={handleSubmitLetter(onSubmitLetter)}
      >

        <input 
          type="text" 
          className="textInput"
          placeholder='Enter Letter'
          {...registerLetter("letter",
            {
              required: "Letter is required!",
              maxLength: {
                value: 1,
                message: "Only ONE LETTER at once!",
              },
              pattern: {
                value: /^[a-zA-Z]$/,
                message: "Only ALPHABET letters!",
              },
            }
          )}
        />
        {errorsLetter.letter && <p className="errorText">{errorsLetter.letter.message}</p>}
        <button className="submitButton" type="submit">
          Check
        </button>
      </form>

      <form className="inputForm" onSubmit={handleSubmitWord(onSubmitWord)}>
        <input
          type="text"
          className="textInput"
          placeholder="Enter Word"
          {...registerWord("word", {
            required: "Word is required!",
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: "Only ALPHABET letters!",
            },
          })}
        />
        {errorsWord.word && (
          <p className="errorText">{errorsWord.word.message}</p>
        )}
        <button className="submitButton" type="submit">
          Check
        </button>
      </form>
    </div>
  );
};

export default Input;
