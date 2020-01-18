import React, { useState, useEffect } from "react";
import LineSegment from "./LineSegment.jsx";

const Path = ({ path }) => {
  const [segments, setSegments] = useState(<></>);

  useEffect(() => {
    if (path.length === 0) {
      var c = document.getElementById("drawing-board");
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
    }
  }, [path]);

  return path.map((point, i) => {
    if (i !== 0 && point.x !== null && path[i - 1].x !== null) {
      return <LineSegment key={i} pointA={path[i - 1]} pointB={point} />;
    }
  });
};

export default Path;
