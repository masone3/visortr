import { useMemo, useState } from "react";
import ComparisonTable from "../components/ComparisonTable";
import Controls from "../components/Controls";
import Grid, { GRID_COLORS } from "../components/Grid";
import { usePlayback } from "../hooks/usePlayback";
import { usePlaybackShortcuts } from "../hooks/usePlaybackShortcuts";
import { PATHFINDERS } from "../pathfinding";
import {
  createGrid,
  setWall,
  setWeight,
  pathCost,
  DEFAULT_START,
  DEFAULT_END,
  DEFAULT_WEIGHT,
  HEAVY_WEIGHT,
} from "../utils/grid";
import { generateMaze, createRandomWalls } from "../utils/generators";

const LEGEND = [
  { key: "start", label: "Start" },
  { key: "end", label: "End" },
  { key: "wall", label: "Wall" },
  { key: "weight", label: `Weight (cost ${HEAVY_WEIGHT})` },
  { key: "frontier", label: "Frontier" },
  { key: "current", label: "Current" },
  { key: "visited", label: "Visited" },
  { key: "path", label: "Path" },
];

const TOOLS = [
  { key: "wall", label: "Wall tool" },
  { key: "weight", label: "Weight tool" },
];

export default function PathfindingView({ active }) {
  const [grid, setGrid] = useState(createGrid);
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [algoKey, setAlgoKey] = useState("astar");
  const [tool, setTool] = useState("wall");

  const algo = PATHFINDERS[algoKey];
  const steps = useMemo(
    () => algo.run(grid, start, end),
    [algo, grid, start, end]
  );
  const playback = usePlayback(steps);
  usePlaybackShortcuts(playback, active);

  const results = useMemo(
    () =>
      Object.entries(PATHFINDERS).map(([key, a]) => {
        const s = a.run(grid, start, end);
        const last = s[s.length - 1];
        const found = last.path.length > 0;
        return {
          key,
          name: a.name,
          visited: last.visited.length,
          found,
          length: found ? last.path.length : null,
          cost: found ? pathCost(grid, last.path) : null,
        };
      }),
    [grid, start, end]
  );

  const finalStep = steps[steps.length - 1];
  const atEnd = playback.index === playback.last;
  const foundPath = finalStep.path.length > 0;
  const currentPath = playback.step.path;

  function handlePaint(row, col, mode) {
    setGrid((current) => {
      switch (mode) {
        case "draw":
          return setWall(current, row, col, true);
        case "erase":
          return setWall(current, row, col, false);
        case "weigh":
          return setWeight(current, row, col, HEAVY_WEIGHT);
        case "unweigh":
          return setWeight(current, row, col, DEFAULT_WEIGHT);
        default:
          return current;
      }
    });
  }

  function handleClearBoard() {
    setGrid(createGrid());
  }

  function handleResetAll() {
    setGrid(createGrid());
    setStart(DEFAULT_START);
    setEnd(DEFAULT_END);
  }

  function handleMaze() {
    const maze = generateMaze();
    setGrid(maze.grid);
    setStart(maze.start);
    setEnd(maze.end);
  }

  function handleRandomWalls() {
    setGrid(createRandomWalls(start, end));
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <select
          value={algoKey}
          onChange={(e) => setAlgoKey(e.target.value)}
          aria-label="Pathfinding algorithm"
        >
          {Object.entries(PATHFINDERS).map(([key, a]) => (
            <option key={key} value={key}>
              {a.name}
            </option>
          ))}
        </select>

        {TOOLS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTool(key)}
            aria-pressed={tool === key}
            style={{
              background: tool === key ? "#38bdf8" : undefined,
              color: tool === key ? "#0f172a" : undefined,
              fontWeight: tool === key ? "bold" : "normal",
            }}
          >
            {label}
          </button>
        ))}

        <button onClick={handleMaze}>Generate maze</button>
        <button onClick={handleRandomWalls}>Random walls</button>
        <button onClick={handleClearBoard}>Clear board</button>
        <button onClick={handleResetAll}>Reset all</button>
      </div>

      <p style={{ fontSize: 14, opacity: 0.8, margin: "8px 0 0" }}>
        Drag to paint with the selected tool (drag over an existing wall or weight to
        remove it). Drag the green and red squares to move them.
      </p>

      <Controls
        isPlaying={playback.isPlaying}
        index={playback.index}
        last={playback.last}
        speed={playback.speed}
        onPlay={playback.play}
        onPause={playback.pause}
        onNext={playback.next}
        onPrev={playback.prev}
        onReset={playback.reset}
        onSpeedChange={playback.setSpeed}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, margin: "12px 0" }}>
        {LEGEND.map(({ key, label }) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: key === "weight" ? "50%" : 3,
                background: GRID_COLORS[key],
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 14 }}>{label}</span>
          </div>
        ))}
      </div>

      <Grid
        grid={grid}
        start={start}
        end={end}
        tool={tool}
        visited={playback.step.visited}
        frontier={playback.step.frontier}
        path={currentPath}
        current={playback.step.current}
        onPaint={handlePaint}
        onMoveStart={setStart}
        onMoveEnd={setEnd}
      />

      <section
        style={{
          marginTop: 16,
          padding: 16,
          maxWidth: 800,
          background: "#1e293b",
          borderRadius: 8,
        }}
      >
        <h2 style={{ marginTop: 0 }}>{algo.name}</h2>
        <p>{algo.info.description}</p>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", margin: "12px 0" }}>
          <div>
            <strong>Cells visited:</strong> {playback.step.visited.length}
          </div>
          <div>
            <strong>Path length:</strong>{" "}
            {currentPath.length > 0 ? currentPath.length : "-"}
          </div>
          <div>
            <strong>Path cost:</strong>{" "}
            {currentPath.length > 0 ? pathCost(grid, currentPath) : "-"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", margin: "12px 0" }}>
          <div>
            <strong>Optimal:</strong> {algo.info.optimal}
          </div>
          <div>
            <strong>Time:</strong> {algo.info.complexity}
          </div>
        </div>
        {atEnd && !foundPath && (
          <p role="status" style={{ color: "#f87171", fontWeight: "bold" }}>
            No path found
          </p>
        )}
        <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>{algo.info.note}</p>
      </section>

      <ComparisonTable results={results} activeKey={algoKey} />
    </>
  );
}