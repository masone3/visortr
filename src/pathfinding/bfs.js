import { toId, fromId, getNeighbors, buildPath } from "../utils/grid";

export function bfs(grid, start, end) {
  const startId = toId(start.row, start.col);
  const endId = toId(end.row, end.col);

  const steps = [];
  const parent = new Map();
  const seen = new Set([startId]);
  const queue = [startId];
  const visited = [];
  let head = 0;

  function record(extra = {}) {
    steps.push({
      visited: [...visited],
      frontier: queue.slice(head),
      path: [],
      current: null,
      ...extra,
    });
  }

  record();

  while (head < queue.length) {
    const id = queue[head++];
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
      if (!seen.has(neighbor)) {
        seen.add(neighbor);
        parent.set(neighbor, id);
        queue.push(neighbor);
      }
    }

    record({ current: id });
  }

  return steps;
}