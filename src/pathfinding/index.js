import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";

export const PATHFINDERS = {
  bfs: {
    name: "Breadth-First Search",
    run: bfs,
    info: {
      description:
        "Explores the grid in rings, always taking the oldest cell from a queue. Every cell at distance 1 is explored before any at distance 2, and so on.",
      optimal: "Fewest steps only (ignores weights)",
      complexity: "O(V + E)",
      note: "V is the number of cells and E the number of connections between them. It treats every cell as equally cheap, so it wades straight through weighted cells.",
    },
  },
  dfs: {
    name: "Depth-First Search",
    run: dfs,
    info: {
      description:
        "Dives down one route as far as it can, always taking the newest cell from a stack, then backtracks when it hits a dead end.",
      optimal: "No: finds a path, usually a long one",
      complexity: "O(V + E)",
      note: "Same cost as BFS, but the route it finds depends on the order it tries directions.",
    },
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    run: dijkstra,
    info: {
      description:
        "Always explores the unexplored cell with the lowest total cost so far, taken from a priority queue. Once a cell is explored, its cost is final.",
      optimal: "Yes: the lowest total cost",
      complexity: "O((V + E) log V)",
      note: "The log V comes from the heap. On a grid with no weights it behaves just like BFS. Weights must not be negative.",
    },
  },
};