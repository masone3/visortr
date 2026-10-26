import { toId, fromId, getNeighbors, buildPath } from "../utils/grid";
import { manhattan } from "../utils/heuristics";
import { MinHeap } from "../utils/MinHeap";

// Only safe because all costs are whole numbers (see Day 11 notes).
const TIE_BREAK = 0.001;

export function astar(grid, start, end) {
  const startId = toId(start.row, start.col);
  const endId = toId(end.row, end.col);

  const steps = [];
  const parent = new Map();
  const gCost = new Map([[startId, 0]]);
  const visited = [];
  const visitedSet = new Set();
  const heap = new MinHeap();

  function priorityOf(id, g) {
    const h = manhattan(fromId(id), end);
    return g + h + h * TIE_BREAK;
  }

  heap.push(startId, priorityOf(startId, 0));

  function record(extra = {}) {
    const frontier = [...new Set(heap.values())].filter(
      (id) => !visitedSet.has(id)
    );
    steps.push({
      visited: [...visited],
      frontier,
      path: [],
      current: null,
      ...extra,
    });
  }

  record();

  while (heap.size > 0) {
    const { value: id } = heap.pop();
    if (visitedSet.has(id)) continue;

    visitedSet.add(id);
    visited.push(id);

    if (id === endId) {
      const path = buildPath(parent, endId);
      record({ current: id });
      for (let i = 1; i <= path.length; i++) {
        record({ path: path.slice(0, i) });
      }
      return steps;
    }

    const g = gCost.get(id);
    const { row, col } = fromId(id);

    for (const neighbor of getNeighbors(grid, row, col)) {
      if (visitedSet.has(neighbor)) continue;

      const n = fromId(neighbor);
      const candidate = g + grid[n.row][n.col].weight;

      if (candidate < (gCost.get(neighbor) ?? Infinity)) {
        gCost.set(neighbor, candidate);
        parent.set(neighbor, id);
        heap.push(neighbor, priorityOf(neighbor, candidate));
      }
    }

    record({ current: id });
  }

  return steps;
}