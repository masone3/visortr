import { bfs } from "./bfs";
import { dfs } from "./dfs";

export const PATHFINDERS = {
  bfs: {
    name: "Breadth-First Search",
    run: bfs,
    info: {
      description:
        "Explores the grid in rings, always taking the oldest cell from a queue. Every cell at distance 1 is explored before any at distance 2, and so on.",
      shortest: "Yes (on unweighted grids)",
      complexity: "O(V + E)",
      note: "V is the number of cells and E the number of connections between them.",
    },
  },
  dfs: {
    name: "Depth-First Search",
    run: dfs,
    info: {
      description:
        "Dives down one route as far as it can, always taking the newest cell from a stack, then backtracks when it hits a dead end.",
      shortest: "No: finds a path, usually a long one",
      complexity: "O(V + E)",
      note: "Same cost as BFS, but the route it finds depends on the order it tries directions.",
    },
  },
};