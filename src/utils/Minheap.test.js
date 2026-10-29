import { describe, it, expect } from "vitest";
import { MinHeap } from "./MinHeap";
import { seededRandom } from "../testUtils/seededRandom";

describe("MinHeap", () => {
  it("returns undefined when empty", () => {
    expect(new MinHeap().pop()).toBeUndefined();
  });

  it("tracks its size", () => {
    const heap = new MinHeap();
    heap.push("a", 3);
    heap.push("b", 1);
    expect(heap.size).toBe(2);
    heap.pop();
    expect(heap.size).toBe(1);
  });

  it("pops values in priority order", () => {
    const heap = new MinHeap();
    [5, 1, 4, 2, 3].forEach((p) => heap.push(`item${p}`, p));

    const out = [];
    while (heap.size > 0) out.push(heap.pop().priority);

    expect(out).toEqual([1, 2, 3, 4, 5]);
  });

  it("pops equal priorities in the order they were pushed", () => {
    const heap = new MinHeap();
    ["a", "b", "c", "d"].forEach((v) => heap.push(v, 1));

    const out = [];
    while (heap.size > 0) out.push(heap.pop().value);

    expect(out).toEqual(["a", "b", "c", "d"]);
  });

  it("lists everything it holds", () => {
    const heap = new MinHeap();
    heap.push("x", 2);
    heap.push("y", 1);
    expect([...heap.values()].sort()).toEqual(["x", "y"]);
  });

  it("always pops the minimum, even with pushes and pops interleaved", () => {
    const rand = seededRandom(7);
    const heap = new MinHeap();
    const model = [];

    for (let i = 0; i < 500; i++) {
      if (model.length === 0 || rand() < 0.6) {
        const priority = Math.floor(rand() * 50);
        heap.push(i, priority);
        model.push(priority);
      } else {
        const smallest = Math.min(...model);
        expect(heap.pop().priority).toBe(smallest);
        model.splice(model.indexOf(smallest), 1);
      }
    }

    expect(heap.size).toBe(model.length);
  });
});