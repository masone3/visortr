import { useState } from "react";
import Grid from "../components/Grid";
import {
  createGrid,
  setWall,
  DEFAULT_START,
  DEFAULT_END,
} from "../utils/grid";

export default function PathfindingView() {
  const [grid, setGrid] = useState(createGrid);
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);

  function handlePaint(row, col, wall) {
    setGrid((current) => setWall(current, row, col, wall));
  }

  function handleClearWalls() {
    setGrid(createGrid());
  }

  function handleResetAll() {
    setGrid(createGrid());
    setStart(DEFAULT_START);
    setEnd(DEFAULT_END);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleClearWalls}>Clear walls</button>
        <button onClick={handleResetAll}>Reset all</button>
        <span style={{ fontSize: 14, opacity: 0.8 }}>
          Click and drag to draw walls (drag over a wall to erase). Drag the
          green and red squares to move them.
        </span>
      </div>

      <div style={{ marginTop: 16 }}>
        <Grid
          grid={grid}
          start={start}
          end={end}
          onPaint={handlePaint}
          onMoveStart={setStart}
          onMoveEnd={setEnd}
        />
      </div>
    </>
  );
}