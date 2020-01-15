import React, { useState, useEffect } from 'react';
import GuessingForm from './GuessingForm.jsx'
import DrawingBoard from './DrawingBoard.jsx'
import Path from './Path.jsx'
import ColorSelector from './ColorSelector.jsx'
import { getRandomWord } from "../helpers"

import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://localhost:3000');
console.log(socket)

const App = () => {
    const [word, setWord] = useState("")
    const [guessing, setGuessing] = useState(false)
    const [path, setPath] = useState([])
    const [color, setColor] = useState('#393E41')
    const [gameInPlay, setGameInPlay] = useState(true)
    const [guesser, setGuesser] = useState(true)

    useEffect(() => {
        randomizeWord()
        startSocket((err, userID) => {
            console.log("socket connection successful: " + userID)
            if (userID === 1) {
                setGuesser(false)
            }
        })
    }, [])

    const startSocket = (cb) => {
        socket.emit('registerUser');
        socket.on('newUserDetails', userID => cb(null, userID));
    }
    const addToPath = (point) => {
        point.color = color
        setPath([...path, point])
    }
    const randomizeWord = () => {
        getRandomWord().then((word) => setWord(word))
    }

    const handleWin = () => {
        setGameInPlay(false)
    }
    const handleReset = () => {
        randomizeWord();
        setGuessing(false);
        setPath([]);
        setGameInPlay(true)
    }
    if (gameInPlay) {
        return <>

            <DrawingBoard addToPath={addToPath} setGuessing={setGuessing} />
            {guessing ? <GuessingForm word={word} handleWin={handleWin} />
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