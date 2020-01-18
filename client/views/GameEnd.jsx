import React from "react";

const GameEnd = ({ wasDrawer, isDrawer, drawerName, emit }) => {
  let message = <h2>{drawerName} guessed it!</h2>;
  if (wasDrawer) {
    message = <h2>Great drawing! {drawerName} guessed it!</h2>;
  } else if (isDrawer) {
    message = <h2>Congrats! You guessed it! </h2>;
  }
  return (
    <div className="prompt">
      {message}
      <button onClick={emit.resetGame}>Next Game</button>
    </div>
  );
};

export default GameEnd;
