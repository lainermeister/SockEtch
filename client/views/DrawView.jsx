import React, { useState } from "react";
import DrawingBoard from "./components/DrawingBoard.jsx";
import Path from "./components/Path.jsx";
import ColorSelector from "./components/ColorSelector";
import UserList from "./components/UserList";
import Guesses from "./components/Guesses.jsx";

const DrawView = ({ game, emit }) => {
  const [color, setColor] = useState("#F6F7EB");
  return (
    <div id="play-area">
      <ColorSelector setColor={setColor} />
      <div id="drawing-col">
        <h2>{game.word}</h2>
        <DrawingBoard addToPath={emit.addToPath} color={color} />
        <Path path={game.path} />
        <div id="bottom-buttons">
          <button onClick={emit.clearDrawing}>Clear Drawing</button>
          <button onClick={emit.giveUp}>Give Up &nbsp;&nbsp;:(</button>
        </div>
      </div>
      <div id="right-col">
        <UserList users={game.users} />
        <Guesses guesses={game.guesses} />
      </div>
    </div>
  );
};

export default DrawView;
