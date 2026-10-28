import { describe, it, expect } from "vitest";
import { ALGORITHMS } from "./index";
import { mergeSort } from "./mergeSort";
import { seededRandom } from "../testUtils/seededRandom";

function makeItems(values) {
  return values.map((value, id) => ({ id, value }));
}

const rand = seededRandom(42);
const randomValues = (n) =>
  Array.from({ length: n }, () => Math.floor(rand() * 90) + 10);

const CASES = {
  empty: [],
  single: [50],
  "two sorted": [10, 20],
  "two reversed": [20, 10],
  sorted: [10, 20, 30, 40, 50, 60, 70, 80],
  reversed: [80, 70, 60, 50, 40, 30, 20, 10],
  "all equal": [5, 5, 5, 5, 5],
  duplicates: [30, 10, 30, 20, 10, 20, 30],
  random: randomValues(40),
  "random large": randomValues(100),
};

describe.each(Object.entries(ALGORITHMS))("%s", (_key, algo) => {
  it.each(Object.entries(CASES))("sorts the %s case", (_name, values) => {
    const steps = algo.run(makeItems(values));
    const finalValues = steps[steps.length - 1].array.map((i) => i.value);

    expect(finalValues).toEqual([...values].sort((a, b) => a - b));
  });

  it("starts on the unsorted input", () => {
    const items = makeItems(CASES.random);
    const steps = algo.run(items);

    expect(steps[0].array).toEqual(items);
  });

  it("does not change the input array", () => {
    const items = makeItems(CASES.random);
    const before = JSON.stringify(items);

    algo.run(items);

    expect(JSON.stringify(items)).toBe(before);
  });

  it("keeps every step a valid permutation of the input", () => {
    for (const [name, values] of Object.entries(CASES)) {
      const items = makeItems(values);
      const expectedIds = items.map((i) => i.id).sort((a, b) => a - b);

      algo.run(items).forEach((step, n) => {
        const ids = step.array.map((i) => i.id).sort((a, b) => a - b);
        expect(ids, `${name}, step ${n}`).toEqual(expectedIds);
      });
    }
  });

  it("only highlights indices that exist", () => {
    for (const [name, values] of Object.entries(CASES)) {
      const size = values.length;

      algo.run(makeItems(values)).forEach((step, n) => {
        const all = [...step.comparing, ...step.swapping, ...step.sorted];
        for (const index of all) {
          expect(index, `${name}, step ${n}`).toBeGreaterThanOrEqual(0);
          expect(index, `${name}, step ${n}`).toBeLessThan(size);
        }
      });
    }
  });

  it("marks every index as sorted in the final step", () => {
    for (const [name, values] of Object.entries(CASES)) {
      const steps = algo.run(makeItems(values));
      const sorted = steps[steps.length - 1].sorted;

      expect(new Set(sorted).size, name).toBe(values.length);
    }
  });
});

describe("merge sort", () => {
  it("is stable: equal values keep their original order", () => {
    const items = makeItems([30, 10, 30, 20, 10, 20, 30, 10]);
    const steps = mergeSort(items);
    const result = steps[steps.length - 1].array;

    for (let i = 1; i < result.length; i++) {
      if (result[i - 1].value === result[i].value) {
        expect(result[i - 1].id).toBeLessThan(result[i].id);
      }
    }
  });
});