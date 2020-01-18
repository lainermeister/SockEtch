import React from "react";
import DrawingBoard from "./components/DrawingBoard.jsx";
import Path from "./components/Path.jsx";
import UserList from "./components/UserList";
import GuessingForm from "./components/GuessingForm.jsx";

const GuessView = ({ game, emit, drawerName }) => {
  return (
    <div id="play-area">
      <div id="drawing-col">
        <h2>{drawerName} is drawing</h2>
        <DrawingBoard addToPath={() => null} color={null} />
        <Path path={game.path} />
        <h3>Category: {game.category}</h3>
      </div>
      <div id="right-col">
        <UserList users={game.users} />
        <GuessingForm
          word={game.word}
          handleWrongGuess={emit.wrongGuess}
          handleWin={emit.endGame}
        />
      </div>
    </div>
  );
};

export default GuessView;
