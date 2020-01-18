import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import socketIOClient from "socket.io-client";
const socket = socketIOClient(window.location.href);

const App = () => {
  const [game, setGame] = useState(null);
  const [disconnected, setDisconnected] = useState(false);
  const [joinError, setJoinError] = useState(null);

  const emit = {
    start: (e, name, option, room) => {
      e.preventDefault();
      setJoinError(null);
      if (name === "") {
        setJoinError("Please enter your name to join.");
      } else {
        if (option !== "create") {
          socket.emit("joinRoom", { name, room });
        } else {
          socket.emit("createRoom", name);
        }
        socket.on("gameDetails", (game) => {
          setGame(game);
        });
        socket.on("notARoom", () => setJoinError("That is not a valid room."));
        socket.on("disconnect", () => {
          setDisconnected(true);
        });
      }
    },
    chooseWord: (category) => {
      socket.emit("chooseWord", {
        category,
        room: game.room
      });
    },
    addToPath: (point) => {
      if (socket.id === game.drawer.current.id) {
        socket.emit("addToPath", { room: game.room, point });
      }
    },
    wrongGuess: (guess) =>
      socket.emit("wrongGuess", { guess, room: game.room }),
    endGame: () => socket.emit("endGame", game.room),
    resetGame: () => socket.emit("resetGame", game.room),
    clearDrawing: () => socket.emit("clearDrawing", game.room),
    giveUp: () => socket.emit("giveUp", game.room)
  };

  return (
    <div>
      {game && game.room !== null ? (
        <div id="room-display">
          <h2>Your Room: {game.room}</h2>
        </div>
      ) : (
        <></>
      )}
      <div id="dynamic-area">
        <Routes
          game={game}
          emit={emit}
          disconnected={disconnected}
          isDrawer={
            game && game.drawer.current && socket.id === game.drawer.current.id
          }
          wasDrawer={
            game &&
            game.drawer.previous &&
            socket.id === game.drawer.previous.id
          }
          joinError={joinError}
          setJoinError={setJoinError}
        />
      </div>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));

export default App;
