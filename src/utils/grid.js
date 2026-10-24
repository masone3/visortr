export const ROWS = 20;
export const COLS = 40;

export const DEFAULT_START = { row: 10, col: 5 };
export const DEFAULT_END = { row: 10, col: 34 };

// up, right, down, left
const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

export function toId(row, col) {
  return row * COLS + col;
}

export function fromId(id) {
  return { row: Math.floor(id / COLS), col: id % COLS };
}

export function createGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ wall: false }))
  );
}

export function setWall(grid, row, col, wall) {
  if (grid[row][col].wall === wall) return grid;

  return grid.map((cells, r) =>
    r !== row
      ? cells
      : cells.map((cell, c) => (c !== col ? cell : { ...cell, wall }))
  );
}

export function getNeighbors(grid, row, col) {
  const result = [];
  for (const [dr, dc] of DIRECTIONS) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (grid[r][c].wall) continue;
    result.push(toId(r, c));
  }
  return result;
}

export function buildPath(parent, endId) {
  const path = [];
  let current = endId;
  while (current !== undefined) {
    path.push(current);
    current = parent.get(current);
  }
  return path.reverse();
}