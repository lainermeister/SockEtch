import React from "react";

const Guesses = ({ guesses }) => (
  <form id="guesses">
    {guesses.map((guess) => (
      <p key={guess.id} className="guess-alert">
        {guess.name} guessed {guess.word}!
      </p>
    ))}
  </form>
);

export default Guesses;
