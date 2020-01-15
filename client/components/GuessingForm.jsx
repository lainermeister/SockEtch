import React, { useState, useEffect } from 'react'

const GuessingForm = ({ word, handleWin }) => {
    const [guess, setGuess] = useState("")
    const [wrongAnswer, setWrongAnswer] = useState(false)
    const submitGuess = (e) => {
        e.preventDefault()
        if (guess.toLowerCase() === word) {
            handleWin()
        } else {
            setWrongAnswer(true)
            setGuess("")
        }
    }
    return <form onSubmit={submitGuess}>
        <input type="text" id="guess-field" value={guess}
            onChange={(e) => {
                setGuess(e.target.value)
                setWrongAnswer(false)
            }}
        />
        {wrongAnswer ? <label>Wrong answer, please try again</label> : <></>}
    </form>
}

export default GuessingForm