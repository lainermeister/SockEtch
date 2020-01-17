import React, { useState, useEffect } from 'react';

const LineSegment = ({ pointA, pointB }) => {
    useEffect(() => {
        var c = document.getElementById("drawing-board");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.strokeStyle = pointB.color
        ctx.stroke();

    })
    return <></>


}

export default LineSegment;