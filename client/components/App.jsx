import React, { useState, useEffect } from 'react';
import GuessingForm from './GuessingForm.jsx'
import DrawingBoard from './DrawingBoard.jsx'
import Path from './Path.jsx'
import ColorSelector from './ColorSelector.jsx'
import UserList from './UserList'
import socketIOClient from "socket.io-client";
const socket = socketIOClient(window.location.href);

const App = () => {
    const [word, setWord] = useState("")
    const [guessing, setGuessing] = useState(false)
    const [path, setPath] = useState([])
    const [color, setColor] = useState('#393E41')
    const [gameState, setGameState] = useState("pre")
    const [drawer, setDrawer] = useState(null)
    const [name, setName] = useState("")
    const [users, setUsers] = useState({})
    const [categories, setCategories] = useState([])

    const startSocket = (e) => {
        e.preventDefault()
        socket.emit('registerUser', name);
        socket.on('gameDetails', ({ drawer, word, path, users, state, categories }) => {
            setCategories(categories)
            setWord(word)
            setDrawer(drawer)
            setPath(path)
            setUsers(users)
            setGameState(state)
        });
        socket.on('updatedPath', path => setPath(path))
    }
    const addToPath = (point) => {
        if (socket.id === drawer.current.id) {
            point.color = color
            socket.emit('addToPath', point)
        }
    }

    const renderStartPrompt = () => {
        return <form onSubmit={startSocket}>
            <label>Enter your name: </label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
        </form>
    }
    const renderChoosingCategory = () => {
        console.log(`categories ${categories}`)
        if (drawer.current.id === socket.id) {
            return <>
                <h1>Choose a category </h1>
                {categories.map((category) => <button key={category}
                    onClick={() => socket.emit("chooseWord", category)}>{category}</button>)}
            </>

        } else {
            return <>
                <h1>{drawer.current.name} is picking a category</h1>
            </>
        }
    }

    const renderPlaying = () => {
        return <>
            {drawer.current.id !== socket.id ? <>
                <GuessingForm word={word} handleWin={() => socket.emit("endGame")} />
            </>
                : <>
                    <ColorSelector setColor={setColor} />
                    <h1>{word}</h1>
                </>}
            <DrawingBoard addToPath={addToPath} setGuessing={setGuessing} />
            <Path path={path} />
            <UserList users={users} />
        </>
    }
    const renderGameEnd = () => {
        let message = <h1>{drawer.current.name} guessed it!</h1>
        if (drawer.previous.id === socket.id) {
            message = <h1>Great drawing! {drawer.current.name} guessed it!</h1>
        } else if (drawer.current.id === socket.id) {
            message = <h1>Congrats! You guessed it! </h1>
        }
        return <>
            {message}
            <button onClick={() => socket.emit('resetGame')}>Next Game</button>
        </>
    }
    if (gameState === "pre") {
        return renderStartPrompt()
    } else if (gameState === "choosingCategory") {
        return renderChoosingCategory()
    } else if (gameState === "playing") {
        return renderPlaying()
    } else {
        return renderGameEnd()
    }
}
export default App;