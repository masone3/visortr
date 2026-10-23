export const ROWS = 20;
export const COLS = 40;

export const DEFAULT_START = { row: 10, col: 5 };
export const DEFAULT_END = { row: 10, col: 34 };

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