import React, { useState, useEffect } from 'react';
import GuessingForm from './GuessingForm.jsx'
import DrawingBoard from './DrawingBoard.jsx'
import Path from './Path.jsx'
import ColorSelector from './ColorSelector.jsx'
import socketIOClient from "socket.io-client";
import { getRandomWord } from "../helpers"

const App = () => {
    const [word, setWord] = useState("")
    const [guessing, setGuessing] = useState(false)
    const [path, setPath] = useState([])
    const [color, setColor] = useState('#393E41')
    const [gameInPlay, setGameInPlay] = useState(true)
    useEffect(() => {
        randomizeWord()
    }, [])

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