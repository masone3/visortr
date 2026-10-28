import { describe, it, expect } from "vitest";
import {
  ROWS,
  COLS,
  DEFAULT_WEIGHT,
  HEAVY_WEIGHT,
  toId,
  fromId,
  createGrid,
  setWall,
  setWeight,
  getNeighbors,
  buildPath,
  pathCost,
} from "./grid";

describe("toId / fromId", () => {
  it("round-trips every cell", () => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        expect(fromId(toId(row, col))).toEqual({ row, col });
      }
    }
  });

  it("gives every cell a unique id", () => {
    const ids = new Set();
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) ids.add(toId(row, col));
    }
    expect(ids.size).toBe(ROWS * COLS);
  });
});

describe("setWall", () => {
  it("returns the same grid object when nothing changes", () => {
    const grid = createGrid();
    expect(setWall(grid, 3, 3, false)).toBe(grid);
  });

  it("returns a new grid and leaves the original untouched", () => {
    const grid = createGrid();
    const next = setWall(grid, 3, 3, true);

    expect(next).not.toBe(grid);
    expect(next[3][3].wall).toBe(true);
    expect(grid[3][3].wall).toBe(false);
  });

  it("reuses rows it did not change", () => {
    const grid = createGrid();
    const next = setWall(grid, 3, 3, true);

    expect(next[0]).toBe(grid[0]);
    expect(next[3]).not.toBe(grid[3]);
  });

  it("resets the weight of a cell that becomes a wall", () => {
    let grid = setWeight(createGrid(), 2, 2, HEAVY_WEIGHT);
    grid = setWall(grid, 2, 2, true);
    expect(grid[2][2].weight).toBe(DEFAULT_WEIGHT);
  });
});

describe("setWeight", () => {
  it("sets the weight of an open cell", () => {
    const grid = setWeight(createGrid(), 1, 1, HEAVY_WEIGHT);
    expect(grid[1][1].weight).toBe(HEAVY_WEIGHT);
  });

  it("refuses to weight a wall", () => {
    const walled = setWall(createGrid(), 1, 1, true);
    expect(setWeight(walled, 1, 1, HEAVY_WEIGHT)).toBe(walled);
  });

  it("returns the same grid when the weight is unchanged", () => {
    const grid = createGrid();
    expect(setWeight(grid, 1, 1, DEFAULT_WEIGHT)).toBe(grid);
  });
});

describe("getNeighbors", () => {
  it("gives a corner cell two neighbors", () => {
    const neighbors = getNeighbors(createGrid(), 0, 0);
    expect(neighbors).toHaveLength(2);
    expect(neighbors).toContain(toId(0, 1));
    expect(neighbors).toContain(toId(1, 0));
  });

  it("gives an interior cell four neighbors", () => {
    expect(getNeighbors(createGrid(), 5, 5)).toHaveLength(4);
  });

  it("skips walls", () => {
    const grid = setWall(createGrid(), 5, 6, true);
    const neighbors = getNeighbors(grid, 5, 5);
    expect(neighbors).toHaveLength(3);
    expect(neighbors).not.toContain(toId(5, 6));
  });
});

describe("buildPath", () => {
  it("follows parents back to the start and returns start-first", () => {
    const parent = new Map([
      [2, 1],
      [1, 0],
    ]);
    expect(buildPath(parent, 2)).toEqual([0, 1, 2]);
  });

  it("returns just the start when the end has no parent", () => {
    expect(buildPath(new Map(), 7)).toEqual([7]);
  });
});

describe("pathCost", () => {
  it("sums the weights of every cell except the first", () => {
    let grid = createGrid();
    grid = setWeight(grid, 0, 1, HEAVY_WEIGHT);
    const path = [toId(0, 0), toId(0, 1), toId(0, 2)];

    expect(pathCost(grid, path)).toBe(HEAVY_WEIGHT + DEFAULT_WEIGHT);
  });
});