import { describe, it, expect } from "vitest";
import { computeStats } from "./stats";

const step = (comparing = [], swapping = []) => ({ comparing, swapping });

describe("computeStats", () => {
  it("returns running totals, one entry per step", () => {
    const steps = [
      step(),
      step([0, 1]),
      step([], [0, 1]),
      step([1, 2]),
    ];

    expect(computeStats(steps)).toEqual([
      { comparisons: 0, swaps: 0 },
      { comparisons: 1, swaps: 0 },
      { comparisons: 1, swaps: 1 },
      { comparisons: 2, swaps: 1 },
    ]);
  });

  it("handles no steps", () => {
    expect(computeStats([])).toEqual([]);
  });
});