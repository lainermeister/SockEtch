import React, { useState, useEffect } from 'react';
import GuessingForm from './GuessingForm.jsx'
import DrawingBoard from './DrawingBoard.jsx'
import Path from './Path.jsx'
import ColorSelector from './ColorSelector.jsx'
// import { getRandomWord } from "../../server/helpers"
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://localhost:3000');

const App = () => {
    const [word, setWord] = useState("")
    const [guessing, setGuessing] = useState(false)
    const [path, setPath] = useState([])
    const [color, setColor] = useState('#393E41')
    const [gameState, setGameState] = useState("pre")
    const [guesser, setGuesser] = useState(true)
    const [name, setName] = useState("")
    const [users, setUsers] = useState([])

    const startSocket = (e) => {
        e.preventDefault()
        socket.emit('registerUser', name);
        socket.on('newUserDetails', ({ drawer, word, path, users }) => {
            setWord(word)
            setGuesser(drawer !== socket.id)
            setPath(path)
            setUsers(users)
            setGameState("playing")
        });
        socket.on('updatedPath', path => {
            setPath(path)
            console.log("updating path")
        })

    }
    const addToPath = (point) => {
        if (!guesser) {
            point.color = color
            socket.emit('updatePath', [...path, point])
        }
    }
    const handleWin = () => {
        setGameState("end")
    }
    const handleReset = () => {
        setGuessing(false);
        setPath([]);
        setGameInPlay(true)
    }

    const renderStartPrompt = () => {
        return <form onSubmit={startSocket}>
            <label>Enter your name: </label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
        </form>
    }

    const renderPlaying = () => {
        return <>
            {guesser ? <>
                <GuessingForm word={word} handleWin={handleWin} />

            </>
                : <>
                    <ColorSelector setColor={setColor} />
                    <h1>{word}</h1>

                </>}
            <DrawingBoard addToPath={addToPath} setGuessing={setGuessing} />
            <Path path={path} />
        </>
    }
    const renderGameEnd = () => {
        return <>
            <h1>You won.</h1>
            <button onClick={handleReset}>Try Again</button>
        </>
    }
    if (gameState === "pre") {
        return renderStartPrompt()
    } else if (gameState === "playing") {
        return renderPlaying()

    } else {
        return renderGameEnd()
    }


}
export default App;