import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ROWS, COLS, toId } from "../utils/grid";

const CELL = 20;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

export const GRID_COLORS = {
  empty: "#0f172a",
  line: "#1e293b",
  wall: "#94a3b8",
  start: "#4ade80",
  end: "#f87171",
  visited: "#2563eb",
  frontier: "#22d3ee",
  current: "#c084fc",
  path: "#facc15",
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
  visited = [],
  frontier = [],
  path = [],
  current = null,
  onPaint,
  onMoveStart,
  onMoveEnd,
}) {
  const drag = useRef(null);

  const visitedSet = useMemo(() => new Set(visited), [visited]);
  const frontierSet = useMemo(() => new Set(frontier), [frontier]);
  const pathSet = useMemo(() => new Set(path), [path]);

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

  function getFill(row, col, cell) {
    const here = { row, col };
    if (sameCell(here, start)) return GRID_COLORS.start;
    if (sameCell(here, end)) return GRID_COLORS.end;
    if (cell.wall) return GRID_COLORS.wall;

    const id = toId(row, col);
    if (pathSet.has(id)) return GRID_COLORS.path;
    if (id === current) return GRID_COLORS.current;
    if (frontierSet.has(id)) return GRID_COLORS.frontier;
    if (visitedSet.has(id)) return GRID_COLORS.visited;
    return GRID_COLORS.empty;
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
        cells.map((cell, col) => (
          <motion.rect
            key={`${row}-${col}`}
            x={col * CELL}
            y={row * CELL}
            width={CELL}
            height={CELL}
            stroke={GRID_COLORS.line}
            strokeWidth={1}
            initial={false}
            animate={{ fill: getFill(row, col, cell) }}
            transition={{ duration: 0.2 }}
          />
        ))
      )}
    </svg>
  );
}