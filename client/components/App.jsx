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
  const [word, setWord] = useState(null);
  const [guessing, setGuessing] = useState(false);
  const [path, setPath] = useState([]);
  const [color, setColor] = useState("#F6F7EB");
  const [gameState, setGameState] = useState("pre");
  const [drawer, setDrawer] = useState(null);
  const [name, setName] = useState("");
  const [users, setUsers] = useState({});
  const [categories, setCategories] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [category, setCategory] = useState(null);
  const [joiningRoom, setJoiningRoom] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [room, setRoom] = useState(null);
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
        console.log("joining room" + joiningRoom);
        socket.emit("joinRoom", { name, room: joiningRoom });
      } else {
        socket.emit("createRoom", name);
      }
      socket.on(
        "gameDetails",
        ({
          drawer,
          word,
          path,
          users,
          state,
          categories,
          guesses,
          category,
          room
        }) => {
          setCategories(categories);
          setWord(word);
          setDrawer(drawer);
          setPath(path);
          setUsers(users);
          setGameState(state);
          setGuesses(guesses);
          setCategory(category);
          setRoom(room);
        }
      );
      socket.on("notARoom", () => setJoinError("That is not a valid room."));
      socket.on("updatedPath", (path) => setPath(path));
      console.log("my socket is " + socket.id);
    }
  };

  const addToPath = (point) => {
    if (socket.id === drawer.current.id) {
      point.color = color;
      socket.emit("addToPath", { room, point });
    }
  };

  const renderStartPrompt = () => {
    return (
      <>
        <h2>Your Name:</h2>
        <form className="prompt" onSubmit={(e) => e.preventDefault()}>
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
    console.log(`categories ${categories}, room ${room}`);
    if (drawer.current.id === socket.id) {
      return (
        <div className="prompt">
          <h3>You've been chosen to draw! Please pick a category: </h3>
          {categories.map((category) => (
            <div className="category-container" key={category}>
              <button
                className="category"
                onClick={() => socket.emit("chooseWord", { category, room })}
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
          <h3>Please hold while {drawer.current.name} selects a category...</h3>
        </div>
      );
    }
  };

  const renderPlaying = () => {
    if (drawer.current.id === socket.id) {
      return (
        <div id="play-area">
          <ColorSelector setColor={setColor} />
          <div id="drawing-col">
            <h2>{word}</h2>

            <DrawingBoard addToPath={addToPath} setGuessing={setGuessing} />
            <Path path={path} />
            <div id="bottom-buttons">
              <button onClick={() => socket.emit("clearDrawing", room)}>
                Clear Drawing
              </button>
              <button onClick={() => socket.emit("giveUp", room)}>
                Give Up &nbsp;&nbsp;:(
              </button>
            </div>
          </div>
          <div id="right-col">
            <UserList users={users} />

            <Guesses guesses={guesses} />
          </div>
        </div>
      );
    } else {
      return (
        <div id="play-area">
          <div className="prompt"></div>
          <div id="drawing-col">
            <h2>{drawer.current.name} is drawing</h2>
            <DrawingBoard addToPath={addToPath} setGuessing={setGuessing} />
            <Path path={path} />
            <h3>Category: {category}</h3>
          </div>
          <div id="right-col">
            <UserList users={users} />
            <GuessingForm
              word={word}
              handleWrongGuess={(guess) =>
                socket.emit("wrongGuess", { guess, room })
              }
              handleWin={() => socket.emit("endGame", room)}
            />
          </div>
        </div>
      );
    }
  };
  const renderGameEnd = () => {
    let message = <h2>{drawer.current.name} guessed it!</h2>;
    if (drawer.previous.id === socket.id) {
      message = <h2>Great drawing! {drawer.current.name} guessed it!</h2>;
    } else if (drawer.current.id === socket.id) {
      message = <h2>Congrats! You guessed it! </h2>;
    }
    return (
      <div className="prompt">
        {message}
        <button onClick={() => socket.emit("resetGame", room)}>
          Next Game
        </button>
      </div>
    );
  };

  return (
    <div>
      {room !== null ? (
        <div id="room-display">
          <h2>Your Room: {room}</h2>
        </div>
      ) : (
        <></>
      )}
      <div id="dynamic-area">
        {gameState === "pre"
          ? renderStartPrompt()
          : gameState === "choosingCategory"
          ? renderChoosingCategory()
          : gameState === "playing"
          ? renderPlaying()
          : renderGameEnd()}
      </div>
    </div>
  );
};
export default App;
