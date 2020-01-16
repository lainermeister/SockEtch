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
    const [gameInPlay, setGameInPlay] = useState(true)
    const [guesser, setGuesser] = useState(true)

    useEffect(() => {
        startSocket((err, data) => {
            console.log("socket connection successful: " + data.userID)
            if (data.userID === 1) {
                setGuesser(false)
            }
            setWord(data.word)
        })
    }, [])

    const startSocket = (cb) => {
        socket.emit('registerUser');
        socket.on('newUserDetails', data => cb(null, data));
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
        setGameInPlay(false)
    }
    const handleReset = () => {
        setGuessing(false);
        setPath([]);
        setGameInPlay(true)
    }
    if (gameInPlay) {
        return <>
            <DrawingBoard addToPath={addToPath} setGuessing={setGuessing} />
            {guesser ? <GuessingForm word={word} handleWin={handleWin} />
                :
                <h1>{word}</h1>}
            <ColorSelector setColor={setColor} />
            <Path path={path} />
        </>

    } else {
        return <>
            <h1>You won.</h1>
            <button onClick={handleReset}>Try Again</button>
        </>
    }
}
export default App;