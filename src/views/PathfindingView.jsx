import { useMemo, useState } from "react";
import Controls from "../components/Controls";
import Grid, { GRID_COLORS } from "../components/Grid";
import { usePlayback } from "../hooks/usePlayback";
import { PATHFINDERS } from "../pathfinding";
import {
  createGrid,
  setWall,
  DEFAULT_START,
  DEFAULT_END,
} from "../utils/grid";

const LEGEND = [
  { key: "start", label: "Start" },
  { key: "end", label: "End" },
  { key: "wall", label: "Wall" },
  { key: "frontier", label: "Frontier" },
  { key: "current", label: "Current" },
  { key: "visited", label: "Visited" },
  { key: "path", label: "Path" },
];

export default function PathfindingView() {
  const [grid, setGrid] = useState(createGrid);
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [algoKey, setAlgoKey] = useState("bfs");

  const algo = PATHFINDERS[algoKey];
  const steps = useMemo(
    () => algo.run(grid, start, end),
    [algo, grid, start, end]
  );
  const playback = usePlayback(steps);

  const finalStep = steps[steps.length - 1];
  const atEnd = playback.index === playback.last;
  const foundPath = finalStep.path.length > 0;

  function handlePaint(row, col, wall) {
    setGrid((current) => setWall(current, row, col, wall));
  }

  function handleClearWalls() {
    setGrid(createGrid());
  }

  function handleResetAll() {
    setGrid(createGrid());
    setStart(DEFAULT_START);
    setEnd(DEFAULT_END);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <select value={algoKey} onChange={(e) => setAlgoKey(e.target.value)}>
          {Object.entries(PATHFINDERS).map(([key, a]) => (
            <option key={key} value={key}>
              {a.name}
            </option>
          ))}
        </select>
        <button onClick={handleClearWalls}>Clear walls</button>
        <button onClick={handleResetAll}>Reset all</button>
        <span style={{ fontSize: 14, opacity: 0.8 }}>
          Drag to draw or erase walls. Drag the green and red squares to move them.
        </span>
      </div>

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
                borderRadius: 3,
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
        visited={playback.step.visited}
        frontier={playback.step.frontier}
        path={playback.step.path}
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
            {playback.step.path.length > 0 ? playback.step.path.length : "-"}
          </div>
          <div>
            <strong>Shortest path guaranteed:</strong> {algo.info.shortest}
          </div>
          <div>
            <strong>Time:</strong> {algo.info.complexity}
          </div>
        </div>
        {atEnd && !foundPath && (
          <p style={{ color: "#f87171", fontWeight: "bold" }}>No path found</p>
        )}
        <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>{algo.info.note}</p>
      </section>
    </>
  );
}