import React, { useState, useEffect } from 'react';
import LineSegment from './LineSegment.jsx'

const DrawingBoard = () => {
    const [path, setPath] = useState([])
    const [drawing, setDrawing] = useState(false)

    const handleDrawStart = (e) => {
        const coordinates = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
        console.log("mouse down: ", coordinates)
        setDrawing(true)
        setPath([...path, coordinates])
    }

    const handleDrawing = (e) => {
        if (drawing) {
            const coordinates = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
            console.log("mouse move: ", coordinates)
            setPath([...path, coordinates])
        }
    }
    const handleDrawEnd = () => {
        console.log("draw end")
        setDrawing(false)
    }
    return <div>
        <canvas id="drawing-board"
            onPointerDown={handleDrawStart}
            onPointerMove={handleDrawing}
            onPointerUp={handleDrawEnd} onPointerOut={handleDrawEnd} />
        {path.map((point, i) => {
            if (i !== 0) {
                return <LineSegment pointA={path[i - 1]} pointB={point} />
            }
        })}
    </div>


}
export default DrawingBoard