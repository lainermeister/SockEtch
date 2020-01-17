import React, { useState, useEffect } from "react";
import GuessingForm from "./GuessingForm.jsx";
import DrawingBoard from "./DrawingBoard.jsx";
import Path from "./Path.jsx";
import ColorSelector from "./ColorSelector.jsx";
import UserList from "./UserList";
import socketIOClient from "socket.io-client";
const socket = socketIOClient(window.location.href);

const App = () => {
  const [word, setWord] = useState("");
  const [guessing, setGuessing] = useState(false);
  const [path, setPath] = useState([]);
  const [color, setColor] = useState("#F6F7EB");
  const [gameState, setGameState] = useState("pre");
  const [drawer, setDrawer] = useState(null);
  const [name, setName] = useState("");
  const [users, setUsers] = useState({});
  const [categories, setCategories] = useState([]);

  const startSocket = (e) => {
    e.preventDefault();
    socket.emit("registerUser", name);
    socket.on(
      "gameDetails",
      ({ drawer, word, path, users, state, categories }) => {
        setCategories(categories);
        setWord(word);
        setDrawer(drawer);
        setPath(path);
        setUsers(users);
        setGameState(state);
      }
    );
    socket.on("updatedPath", (path) => setPath(path));
    console.log("my socket is " + socket.id);
  };
  const addToPath = (point) => {
    if (socket.id === drawer.current.id) {
      point.color = color;
      socket.emit("addToPath", point);
    }
  };

  const renderStartPrompt = () => {
    return (
      <form className="prompt" onSubmit={startSocket}>
        <h2>Enter your name:</h2>
        <input
          className="textbox"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </form>
    );
  };
  const renderChoosingCategory = () => {
    console.log(`categories ${categories}`);
    if (drawer.current.id === socket.id) {
      return (
        <div className="prompt">
          <h2>You've been chosen to draw! </h2>
          <h3>Please pick a category: </h3>
          {categories.map((category) => (
            <div className="category-container" key={category}>
              <button
                className="category"
                onClick={() => socket.emit("chooseWord", category)}
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
          <h2>{drawer.current.name} is picking a category</h2>
        </div>
      );
    }
  };

  const renderPlaying = () => {
    return (
      <div id="play-area">
        {drawer.current.id !== socket.id ? (
          <div className="prompt"></div>
        ) : (
          <ColorSelector setColor={setColor} />
        )}
        <div id="drawing-col">
          {drawer.current.id === socket.id ? (
            <h2>{word}</h2>
          ) : (
            <h2>{drawer.current.name} is drawing.</h2>
          )}
          <DrawingBoard addToPath={addToPath} setGuessing={setGuessing} />
          <Path path={path} />
        </div>
        <div id="right-col">
          <UserList users={users} />
          {drawer.current.id === socket.id ? (
            <></>
          ) : (
            <GuessingForm
              word={word}
              handleWin={() => socket.emit("endGame")}
            />
          )}
        </div>
      </div>
    );
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
        <button onClick={() => socket.emit("resetGame")}>Next Game</button>
      </div>
    );
  };
  if (gameState === "pre") {
    return renderStartPrompt();
  } else if (gameState === "choosingCategory") {
    return renderChoosingCategory();
  } else if (gameState === "playing") {
    return renderPlaying();
  } else {
    return renderGameEnd();
  }
};
export default App;
