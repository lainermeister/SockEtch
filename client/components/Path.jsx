import React from 'react'
import LineSegment from './LineSegment.jsx'

const Path = ({ path }) => {
    return path.map((point, i) => {
        if (i !== 0 && point.x !== null && path[i - 1].x !== null) {
            return <LineSegment pointA={path[i - 1]} pointB={point} />
        }
    })
}

export default Path