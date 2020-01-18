import React, { useState, useEffect } from "react";

const DrawingBoard = ({ addToPath }) => {
  const [drawing, setDrawing] = useState(false);

  const handleDrawStart = (e) => {
    setDrawing(true);
    addToPath({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  };

  const handleDrawing = (e) => {
    if (drawing) {
      addToPath({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      });
    }
  };
  const handleDrawEnd = (e) => {
    setDrawing(false);
    addToPath({
      x: null,
      y: null
    });
  };
  return (
    <canvas
      id="drawing-board"
      width="500"
      height="300"
      onPointerDown={handleDrawStart}
      onPointerMove={handleDrawing}
      onPointerUp={handleDrawEnd}
      onPointerOut={handleDrawEnd}
    >
      Your browser doesn't support the HTML5 canvas tag.
    </canvas>
  );
};
export default DrawingBoard;
