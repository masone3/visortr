import { toId, fromId, getNeighbors, buildPath } from "../utils/grid";
import { MinHeap } from "../utils/MinHeap";

export function dijkstra(grid, start, end) {
  const startId = toId(start.row, start.col);
  const endId = toId(end.row, end.col);

  const steps = [];
  const parent = new Map();
  const dist = new Map([[startId, 0]]);
  const visited = [];
  const visitedSet = new Set();
  const heap = new MinHeap();
  heap.push(startId, 0);

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
    const { value: id, priority } = heap.pop();
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

    const { row, col } = fromId(id);
    for (const neighbor of getNeighbors(grid, row, col)) {
      if (visitedSet.has(neighbor)) continue;

      const n = fromId(neighbor);
      const candidate = priority + grid[n.row][n.col].weight;

      if (candidate < (dist.get(neighbor) ?? Infinity)) {
        dist.set(neighbor, candidate);
        parent.set(neighbor, id);
        heap.push(neighbor, candidate);
      }
    }

    record({ current: id });
  }

  return steps;
}