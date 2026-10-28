import { describe, it, expect } from "vitest";
import { PATHFINDERS } from "./index";
import { bfs } from "./bfs";
import { dijkstra } from "./dijkstra";
import { astar } from "./astar";
import { dfs } from "./dfs";
import {
  ROWS,
  COLS,
  DEFAULT_START,
  DEFAULT_END,
  HEAVY_WEIGHT,
  toId,
  fromId,
  createGrid,
  setWall,
  setWeight,
  getNeighbors,
  pathCost,
} from "../utils/grid";
import { generateMaze, createRandomWalls } from "../utils/generators";
import { manhattan } from "../utils/heuristics";
import { seededRandom } from "../testUtils/seededRandom";

function run(algo, grid, start = DEFAULT_START, end = DEFAULT_END) {
  const steps = algo(grid, start, end);
  return { steps, last: steps[steps.length - 1] };
}

function sameCell(a, b) {
  return a.row === b.row && a.col === b.col;
}

function randomGrid(seed, { wallChance = 0.25, weightChance = 0 } = {}) {
  const rand = seededRandom(seed);
  let grid = createGrid();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const here = { row, col };
      if (sameCell(here, DEFAULT_START) || sameCell(here, DEFAULT_END)) continue;

      if (rand() < wallChance) {
        grid = setWall(grid, row, col, true);
      } else if (rand() < weightChance) {
        grid = setWeight(grid, row, col, HEAVY_WEIGHT);
      }
    }
  }
  return grid;
}

function expectValidPath(grid, path, start, end) {
  expect(path[0]).toBe(toId(start.row, start.col));
  expect(path[path.length - 1]).toBe(toId(end.row, end.col));

  path.forEach((id, i) => {
    const { row, col } = fromId(id);
    expect(grid[row][col].wall).toBe(false);

    if (i > 0) {
      const prev = fromId(path[i - 1]);
      expect(Math.abs(prev.row - row) + Math.abs(prev.col - col)).toBe(1);
    }
  });
}

const SEEDS = Array.from({ length: 30 }, (_, i) => i + 1);

describe.each(Object.entries(PATHFINDERS))("%s", (_key, algo) => {
  it("finds a valid path on an empty board", () => {
    const grid = createGrid();
    const { last } = run(algo.run, grid);

    expect(last.path.length).toBeGreaterThan(0);
    expectValidPath(grid, last.path, DEFAULT_START, DEFAULT_END);
  });

  it("handles the start being the same cell as the end", () => {
    const { last } = run(algo.run, createGrid(), DEFAULT_START, DEFAULT_START);
    expect(last.path).toEqual([toId(DEFAULT_START.row, DEFAULT_START.col)]);
  });

  it("reports no path and explores everything reachable when the end is walled in", () => {
    let grid = createGrid();
    const sealed = getNeighbors(grid, DEFAULT_END.row, DEFAULT_END.col);
    for (const id of sealed) {
      const { row, col } = fromId(id);
      grid = setWall(grid, row, col, true);
    }

    const { last } = run(algo.run, grid);

    expect(last.path).toEqual([]);
    // every cell except the 4 walls and the unreachable end
    expect(last.visited).toHaveLength(ROWS * COLS - sealed.length - 1);
  });

  it("never visits a wall or a cell twice, and visited only grows", () => {
    const grid = randomGrid(99);
    const { steps } = run(algo.run, grid);

    const finalVisited = steps[steps.length - 1].visited;
    expect(new Set(finalVisited).size).toBe(finalVisited.length);

    for (const id of finalVisited) {
      const { row, col } = fromId(id);
      expect(grid[row][col].wall).toBe(false);
    }

    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].visited.length).toBeGreaterThanOrEqual(
        steps[i - 1].visited.length
      );
    }
  });

  it("returns valid paths across many random boards", () => {
    for (const seed of SEEDS) {
      const grid = randomGrid(seed);
      const { last } = run(algo.run, grid);

      if (last.path.length > 0) {
        expectValidPath(grid, last.path, DEFAULT_START, DEFAULT_END);
      }
    }
  });
});

describe("agreement between algorithms", () => {
  it("BFS, Dijkstra, and A* find the same path length on unweighted boards", () => {
    for (const seed of SEEDS) {
      const grid = randomGrid(seed);
      const b = run(bfs, grid).last.path.length;
      const d = run(dijkstra, grid).last.path.length;
      const a = run(astar, grid).last.path.length;

      expect(d, `seed ${seed}`).toBe(b);
      expect(a, `seed ${seed}`).toBe(b);
    }
  });

  it("Dijkstra and A* find the same path cost on weighted boards", () => {
    for (const seed of SEEDS) {
      const grid = randomGrid(seed, { wallChance: 0.2, weightChance: 0.3 });
      const d = run(dijkstra, grid).last.path;
      const a = run(astar, grid).last.path;

      expect(a.length > 0, `seed ${seed}`).toBe(d.length > 0);
      if (d.length > 0) {
        expect(pathCost(grid, a), `seed ${seed}`).toBe(pathCost(grid, d));
      }
    }
  });

  it("no algorithm beats Dijkstra's cost on weighted boards", () => {
    for (const seed of SEEDS) {
      const grid = randomGrid(seed, { wallChance: 0.2, weightChance: 0.3 });
      const best = run(dijkstra, grid).last.path;
      if (best.length === 0) continue;

      for (const algo of [bfs, dfs]) {
        const other = run(algo, grid).last.path;
        expect(pathCost(grid, other), `seed ${seed}`).toBeGreaterThanOrEqual(
          pathCost(grid, best)
        );
      }
    }
  });

  it("DFS finds a path exactly when BFS does", () => {
    for (const seed of SEEDS) {
      const grid = randomGrid(seed);
      const b = run(bfs, grid).last.path.length > 0;
      const d = run(dfs, grid).last.path.length > 0;

      expect(d, `seed ${seed}`).toBe(b);
    }
  });
});

describe("specific behaviors", () => {
  it("BFS path length equals Manhattan distance + 1 on an empty board", () => {
    const { last } = run(bfs, createGrid());
    expect(last.path.length).toBe(manhattan(DEFAULT_START, DEFAULT_END) + 1);
  });

  it("A* explores fewer cells than Dijkstra on an empty board", () => {
    const grid = createGrid();
    const a = run(astar, grid).last.visited.length;
    const d = run(dijkstra, grid).last.visited.length;

    expect(a).toBeLessThan(d);
  });

  it("Dijkstra and A* detour around a costly band; BFS wades through it", () => {
    let grid = createGrid();
    for (let row = 0; row <= 13; row++) {
      for (const col of [19, 20, 21]) {
        grid = setWeight(grid, row, col, HEAVY_WEIGHT);
      }
    }

    const b = run(bfs, grid).last.path;
    const d = run(dijkstra, grid).last.path;
    const a = run(astar, grid).last.path;

    // BFS: 29 steps straight along the row, crossing three cost-5 cells.
    expect(b.length).toBe(30);
    expect(pathCost(grid, b)).toBe(41);

    // Detour below the band: 8 extra steps, but every cell costs 1.
    expect(pathCost(grid, d)).toBe(37);
    expect(pathCost(grid, a)).toBe(37);
    expect(d.length).toBeGreaterThan(b.length);
  });
});

describe("generators", () => {
  function openCells(grid) {
    return grid.flat().filter((cell) => !cell.wall).length;
  }

  function floodFillCount(grid, start) {
    const seen = new Set([toId(start.row, start.col)]);
    const stack = [toId(start.row, start.col)];

    while (stack.length > 0) {
      const { row, col } = fromId(stack.pop());
      for (const next of getNeighbors(grid, row, col)) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
    return seen.size;
  }

  it("generateMaze puts start and end on open cells", () => {
    const { grid, start, end } = generateMaze();

    expect(grid[start.row][start.col].wall).toBe(false);
    expect(grid[end.row][end.col].wall).toBe(false);
  });

  it("generateMaze makes a perfect maze: all open cells connected, no loops", () => {
    for (let i = 0; i < 10; i++) {
      const { grid, start } = generateMaze();

      let rooms = 0;
      for (let row = 1; row < ROWS; row += 2) {
        for (let col = 1; col < COLS; col += 2) rooms++;
      }

      // everything reachable...
      expect(floodFillCount(grid, start)).toBe(openCells(grid));
      // ...and a tree: n rooms joined by n - 1 passages
      expect(openCells(grid)).toBe(2 * rooms - 1);
    }
  });

  it("generateMaze can be solved by every algorithm", () => {
    const { grid, start, end } = generateMaze();

    for (const algo of Object.values(PATHFINDERS)) {
      const { last } = run(algo.run, grid, start, end);
      expectValidPath(grid, last.path, start, end);
    }
  });

  it("createRandomWalls never walls the start or end", () => {
    const grid = createRandomWalls(DEFAULT_START, DEFAULT_END, 1);

    expect(grid[DEFAULT_START.row][DEFAULT_START.col].wall).toBe(false);
    expect(grid[DEFAULT_END.row][DEFAULT_END.col].wall).toBe(false);
    expect(openCells(grid)).toBe(2);
  });

  it("createRandomWalls with density 0 makes no walls", () => {
    const grid = createRandomWalls(DEFAULT_START, DEFAULT_END, 0);
    expect(openCells(grid)).toBe(ROWS * COLS);
  });
});