import React, { useState, useEffect } from "react";

import DrawingBoard from "./DrawingBoard.jsx";
import Path from "./Path.jsx";
import ColorSelector from "./ColorSelector.jsx";
import UserList from "./UserList";
import GuessingForm from "./GuessingForm.jsx";
import Guesses from "./Guesses.jsx";

import socketIOClient from "socket.io-client";
const socket = socketIOClient(window.location.href);

const App = () => {
  const [game, setGame] = useState(null);
  const [color, setColor] = useState("#F6F7EB");
  const [name, setName] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [disconnected, setDisconnected] = useState(false);

  useEffect(() => {
    setJoinError(null);
  }, [name]);

  const startSocket = (e, option) => {
    e.preventDefault();
    setJoinError(null);
    if (name === "") {
      setJoinError("Please enter your name to join.");
    } else {
      if (option !== "create") {
        socket.emit("joinRoom", { name, room: joiningRoom });
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
  };

  const addToPath = (point) => {
    if (socket.id === game.drawer.current.id) {
      point.color = color;
      socket.emit("addToPath", { room: game.room, point });
    }
  };

  const renderStartPrompt = () => {
    return (
      <>
        <form className="prompt" onSubmit={(e) => e.preventDefault()}>
          <h2>Your Name:</h2>
          <div>
            <input
              type="text"
              className="textbox"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            {joiningRoom === null ? (
              <div>
                <input
                  type="button"
                  value="Join Room"
                  onClick={() => setJoiningRoom("")}
                />
              </div>
            ) : (
              <div>
                <div>
                  <h2>Room ID:</h2>
                </div>
                <div>
                  <input
                    type="text"
                    className="textbox"
                    value={joiningRoom}
                    onChange={(e) =>
                      setJoiningRoom(e.target.value.toUpperCase())
                    }
                  />
                </div>
                <div>
                  <input
                    type="button"
                    value={`Join ${joiningRoom}`}
                    onClick={(e) => startSocket(e, "join")}
                  />
                </div>
              </div>
            )}
            <div>
              <input
                type="button"
                value="Create Room"
                onClick={(e) => {
                  startSocket(e, "create");
                }}
              />
            </div>
            {joinError ? (
              <div className="error-message">
                <label>{joinError}</label>
              </div>
            ) : (
              <></>
            )}
          </div>
        </form>
      </>
    );
  };
  const renderChoosingCategory = () => {
    if (game.drawer.current.id === socket.id) {
      return (
        <div className="prompt">
          <h3>You've been chosen to draw! Please pick a category: </h3>
          {game.categories.map((category) => (
            <div className="category-container" key={category}>
              <button
                className="category"
                onClick={() =>
                  socket.emit("chooseWord", {
                    category,
                    room: game.room
                  })
                }
              >
                {category}
              </button>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="prompt">
          <h3>
            Please hold while {game.drawer.current.name} selects a category...
          </h3>
        </div>
      );
    }
  };

  const renderPlaying = () => {
    if (game.drawer.current.id === socket.id) {
      return (
        <div id="play-area">
          <ColorSelector setColor={setColor} />
          <div id="drawing-col">
            <h2>{game.word}</h2>
            <DrawingBoard addToPath={addToPath} />
            <Path path={game.path} />
            <div id="bottom-buttons">
              <button onClick={() => socket.emit("clearDrawing", game.room)}>
                Clear Drawing
              </button>
              <button onClick={() => socket.emit("giveUp", game.room)}>
                Give Up &nbsp;&nbsp;:(
              </button>
            </div>
          </div>
          <div id="right-col">
            <UserList users={game.users} />
            <Guesses guesses={game.guesses} />
          </div>
        </div>
      );
    } else {
      return (
        <div id="play-area">
          <div id="drawing-col">
            <h2>{game.drawer.current.name} is drawing</h2>
            <DrawingBoard addToPath={addToPath} />
            <Path path={game.path} />
            <h3>Category: {game.category}</h3>
          </div>
          <div id="right-col">
            <UserList users={game.users} />
            <GuessingForm
              word={game.word}
              handleWrongGuess={(guess) =>
                socket.emit("wrongGuess", { guess, room: game.room })
              }
              handleWin={() => socket.emit("endGame", game.room)}
            />
          </div>
        </div>
      );
    }
  };
  const renderGameEnd = () => {
    let message = <h2>{game.drawer.current.name} guessed it!</h2>;
    if (game.drawer.previous.id === socket.id) {
      message = <h2>Great drawing! {game.drawer.current.name} guessed it!</h2>;
    } else if (game.drawer.current.id === socket.id) {
      message = <h2>Congrats! You guessed it! </h2>;
    }
    return (
      <div className="prompt">
        {message}
        <button onClick={() => socket.emit("resetGame", game.room)}>
          Next Game
        </button>
      </div>
    );
  };

  const renderDisconnected = () => {
    return (
      <div className="prompt">
        <h3>
          It looks like you've been disconnected. Please refresh your browser.
        </h3>
      </div>
    );
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
        {!game
          ? renderStartPrompt()
          : disconnected
          ? renderDisconnected()
          : game.state === "choosingCategory"
          ? renderChoosingCategory()
          : game.state === "playing"
          ? renderPlaying()
          : renderGameEnd()}
      </div>
    </div>
  );
};
export default App;
