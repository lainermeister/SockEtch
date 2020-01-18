import React, { useState, useEffect } from "react";

const GuessingForm = ({ word, handleWin, handleWrongGuess }) => {
  const [guess, setGuess] = useState("");
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const submitGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === word) {
      handleWin();
    } else {
      handleWrongGuess(guess);
      setWrongAnswer(true);
      setGuess("");
    }
  };
  return (
    <form id="guessing-form" onSubmit={submitGuess} autocomplete="off">
      <h3>What's your best guess?</h3>
      <input
        className="textbox"
        type="text"
        id="guess-field"
        value={guess}
        onChange={(e) => {
          setGuess(e.target.value);
          setWrongAnswer(false);
        }}
      />
      {wrongAnswer ? (
        <label className="error-message">Wrong, please try again.</label>
      ) : (
        <></>
      )}
    </form>
  );
};

export default GuessingForm;
