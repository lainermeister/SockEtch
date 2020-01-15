import React, { useState, useEffect } from 'react';
import DrawingBoard from './DrawingBoard.jsx'
import Path from './Path.jsx'
import ColorSelector from './ColorSelector.jsx'
import socketIOClient from "socket.io-client";

const App = () => {

    const [path, setPath] = useState([])
    const [color, setColor] = useState('#393E41')
    const addToPath = (point) => {
        point.color = color
        setPath([...path, point])
    }

    return <>
        <DrawingBoard addToPath={addToPath} />
        <ColorSelector setColor={setColor} />
        <Path path={path} />
    </>
}
export default App;