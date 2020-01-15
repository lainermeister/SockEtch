import React, { useState, useEffect } from 'react';

const LineSegment = ({ pointA, pointB }) => {
    var c = document.getElementById("drawing-board");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.stroke();
    console.log(ctx)

    return <></>
}

export default LineSegment;