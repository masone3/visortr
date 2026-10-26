export const ROWS = 20;
export const COLS = 40;

export const DEFAULT_START = { row: 10, col: 5 };
export const DEFAULT_END = { row: 10, col: 34 };

export const DEFAULT_WEIGHT = 1;
export const HEAVY_WEIGHT = 5;

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
    Array.from({ length: COLS }, () => ({
      wall: false,
      weight: DEFAULT_WEIGHT,
    }))
  );
}

function updateCell(grid, row, col, changes) {
  return grid.map((cells, r) =>
    r !== row
      ? cells
      : cells.map((cell, c) => (c !== col ? cell : { ...cell, ...changes }))
  );
}

export function setWall(grid, row, col, wall) {
  const cell = grid[row][col];
  if (cell.wall === wall) return grid;
  return updateCell(grid, row, col, {
    wall,
    weight: wall ? DEFAULT_WEIGHT : cell.weight,
  });
}

export function setWeight(grid, row, col, weight) {
  const cell = grid[row][col];
  if (cell.wall || cell.weight === weight) return grid;
  return updateCell(grid, row, col, { weight });
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

export function pathCost(grid, path) {
  return path.slice(1).reduce((sum, id) => {
    const { row, col } = fromId(id);
    return sum + grid[row][col].weight;
  }, 0);
}