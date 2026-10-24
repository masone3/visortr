import { toId, fromId, getNeighbors, buildPath } from "../utils/grid";

export function dfs(grid, start, end) {
  const startId = toId(start.row, start.col);
  const endId = toId(end.row, end.col);

  const steps = [];
  const parent = new Map();
  const visited = [];
  const visitedSet = new Set();
  const stack = [{ id: startId, parentId: null }];

  function getFrontier() {
    const ids = new Set(stack.map((entry) => entry.id));
    return [...ids].filter((id) => !visitedSet.has(id));
  }

  function record(extra = {}) {
    steps.push({
      visited: [...visited],
      frontier: getFrontier(),
      path: [],
      current: null,
      ...extra,
    });
  }

  record();

  while (stack.length > 0) {
    const { id, parentId } = stack.pop();
    if (visitedSet.has(id)) continue;

    visitedSet.add(id);
    visited.push(id);
    if (parentId !== null) parent.set(id, parentId);

    if (id === endId) {
      const path = buildPath(parent, endId);
      record({ current: id });
      for (let i = 1; i <= path.length; i++) {
        record({ path: path.slice(0, i) });
      }
      return steps;
    }

    const { row, col } = fromId(id);
    const neighbors = getNeighbors(grid, row, col);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visitedSet.has(neighbors[i])) {
        stack.push({ id: neighbors[i], parentId: id });
      }
    }

    record({ current: id });
  }

  return steps;
}