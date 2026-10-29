# Visortr

**See algorithms think.** An interactive visualizer for sorting and pathfinding algorithms, built with React, SVG, and Framer Motion.

**[Live demo](https://masone3.github.io/visortr/>)**


## Features

- **Six algorithms** across two views, each with a live explanation and complexity table
- **Playback controls:** play, pause, step forward and backward, adjustable speed
- **Live counters** for comparisons and swaps (sorting) and cells visited, path length, and path cost (pathfinding)
- **Interactive grid:** draw walls, paint weighted cells, drag the start and end squares
- **Maze generator** (recursive backtracker) and random walls
- **Comparison table** that runs every pathfinder on your board so you can see the differences as numbers
- **Keyboard shortcuts**, focus outlines, and reduced-motion support
- **Responsive layout** that works on phones

## Algorithms

| Algorithm | Best | Average | Worst | Notes |
|---|---|---|---|---|
| Bubble Sort | O(n²) | O(n²) | O(n²) | Warm-up algorithm used to test the playback engine |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | Stable, always the same speed |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | Last-element pivot, so sorted input is the worst case |

| Pathfinder | Optimal? | Time | Data structure |
|---|---|---|---|
| BFS | Fewest steps | O(V + E) | Queue |
| DFS | No | O(V + E) | Stack |
| Dijkstra | Lowest cost | O((V + E) log V) | Min-heap |
| A* | Lowest cost | O((V + E) log V) | Min-heap + Manhattan heuristic |

## Keyboard shortcuts

| Key | Action |
|---|---|
| Space | Play / pause |
| ← / → | Step backward / forward |
| R | Reset |

## Run locally

```bash
git clone https://github.com/<your-username>/visortr.git
cd visortr
npm install
npm run dev
```

Other scripts: `npm test`, `npm run test:watch`, `npm run lint`, `npm run build`.

## How it works

Every algorithm is a **pure function that returns a list of steps** instead of animating directly. A step is a snapshot of everything the screen needs: the array or grid, plus which items are being compared, swapped, visited, and so on.

A separate **playback hook** (`usePlayback`) walks through that list with a reducer and a chain of timeouts. React renders whichever step is current, and Framer Motion animates the change between steps. This separation means:

- algorithms know nothing about React, so they are easy to test
- one playback engine drives all seven algorithms
- stepping backward is free, because every step is a full snapshot
- adding an algorithm is one function plus one registry entry

## Project structure

```
src/
  algorithms/    sorting step generators and registry
  pathfinding/   BFS, DFS, Dijkstra, A* and registry
  components/    BarChart, Grid, Controls, Legend, InfoPanel,
                 Toolbar, ComparisonTable, ErrorBoundary
  constants/     shared color palettes
  hooks/         usePlayback, usePlaybackShortcuts
  utils/         grid model, array helpers, min-heap, heuristics,
                 maze generator, step statistics
  views/         SortingView, PathfindingView
  testUtils/     seeded random number generator
```

## Testing

Tests use [Vitest](https://vitest.dev). Because the algorithms are pure functions, the tests check **invariants** rather than exact outputs:

- every sorter sorts, on edge cases and on random data
- every step is a valid permutation (no lost or duplicated items)
- every path starts at the start, ends at the end, avoids walls, and moves one cell at a time
- the algorithms are checked against each other: Dijkstra and A* must agree on cost, and BFS must match Dijkstra on unweighted boards
- the heap is checked against a simple array model over 500 random operations

Randomized tests use a seeded generator so any failure is reproducible.

## Tech stack

React, Framer Motion, SVG, Vite, Vitest, GitHub Actions

## Ideas for the future

- More algorithms: insertion sort, heap sort, greedy best-first, bidirectional BFS
- Side-by-side comparison of two algorithms on the same input
- Shareable boards via the URL
- Canvas renderer for much larger grids
- TypeScript migration