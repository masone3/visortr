import { ROWS, COLS, createGrid } from "./grid";

const JUMPS = [
  [-2, 0],
  [0, 2],
  [2, 0],
  [0, -2],
];

export function generateMaze() {
  const solid = Array.from({ length: ROWS }, () => Array(COLS).fill(true));

  solid[1][1] = false;
  const stack = [{ row: 1, col: 1 }];

  while (stack.length > 0) {
    const { row, col } = stack[stack.length - 1];

    const options = [];
    for (const [dr, dc] of JUMPS) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 1 && r < ROWS && c >= 1 && c < COLS && solid[r][c]) {
        options.push({ r, c, dr, dc });
      }
    }

    if (options.length === 0) {
      stack.pop();
      continue;
    }

    const pick = options[Math.floor(Math.random() * options.length)];
    solid[row + pick.dr / 2][col + pick.dc / 2] = false;
    solid[pick.r][pick.c] = false;
    stack.push({ row: pick.r, col: pick.c });
  }

  const grid = createGrid().map((cells, row) =>
    cells.map((cell, col) => ({ ...cell, wall: solid[row][col] }))
  );

  const lastRow = ROWS % 2 === 0 ? ROWS - 1 : ROWS - 2;
  const lastCol = COLS % 2 === 0 ? COLS - 1 : COLS - 2;

  return {
    grid,
    start: { row: 1, col: 1 },
    end: { row: lastRow, col: lastCol },
  };
}

export function createRandomWalls(start, end, density = 0.25) {
  return createGrid().map((cells, row) =>
    cells.map((cell, col) => {
      const isStart = row === start.row && col === start.col;
      const isEnd = row === end.row && col === end.col;
      return isStart || isEnd ? cell : { ...cell, wall: Math.random() < density };
    })
  );
}