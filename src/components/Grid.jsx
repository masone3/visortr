import { useRef } from "react";
import { ROWS, COLS } from "../utils/grid";

const CELL = 20;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

export const GRID_COLORS = {
  empty: "#0f172a",
  line: "#1e293b",
  wall: "#94a3b8",
  start: "#4ade80",
  end: "#f87171",
};

function sameCell(a, b) {
  return a.row === b.row && a.col === b.col;
}

function cellFromEvent(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const col = Math.floor(((event.clientX - rect.left) / rect.width) * COLS);
  const row = Math.floor(((event.clientY - rect.top) / rect.height) * ROWS);
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
  return { row, col };
}

export default function Grid({
  grid,
  start,
  end,
  onPaint,
  onMoveStart,
  onMoveEnd,
}) {
  const drag = useRef(null);

  function apply(cell) {
    const mode = drag.current;

    if (mode === "draw" || mode === "erase") {
      if (sameCell(cell, start) || sameCell(cell, end)) return;
      onPaint(cell.row, cell.col, mode === "draw");
    } else if (mode === "start") {
      if (grid[cell.row][cell.col].wall || sameCell(cell, end)) return;
      onMoveStart(cell);
    } else if (mode === "end") {
      if (grid[cell.row][cell.col].wall || sameCell(cell, start)) return;
      onMoveEnd(cell);
    }
  }

  function handlePointerDown(event) {
    const cell = cellFromEvent(event);
    if (!cell) return;

    if (sameCell(cell, start)) drag.current = "start";
    else if (sameCell(cell, end)) drag.current = "end";
    else drag.current = grid[cell.row][cell.col].wall ? "erase" : "draw";

    event.currentTarget.setPointerCapture(event.pointerId);
    apply(cell);
  }

  function handlePointerMove(event) {
    if (!drag.current) return;
    const cell = cellFromEvent(event);
    if (cell) apply(cell);
  }

  function handlePointerUp() {
    drag.current = null;
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
      style={{
        display: "block",
        maxWidth: WIDTH,
        touchAction: "none",
        userSelect: "none",
        cursor: "pointer",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {grid.flatMap((cells, row) =>
        cells.map((cell, col) => {
          const here = { row, col };
          let fill = cell.wall ? GRID_COLORS.wall : GRID_COLORS.empty;
          if (sameCell(here, start)) fill = GRID_COLORS.start;
          if (sameCell(here, end)) fill = GRID_COLORS.end;

          return (
            <rect
              key={`${row}-${col}`}
              x={col * CELL}
              y={row * CELL}
              width={CELL}
              height={CELL}
              fill={fill}
              stroke={GRID_COLORS.line}
              strokeWidth={1}
            />
          );
        })
      )}
    </svg>
  );
}