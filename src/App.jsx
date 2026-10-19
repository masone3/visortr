import { useMemo, useState } from "react";
import BarChart from "./components/BarChart";
import Controls from "./components/Controls";
import { usePlayback } from "./hooks/usePlayback";
import { ALGORITHMS } from "./algorithms";
import { createItems, createSortedItems } from "./utils/array";

const DEFAULT_SIZE = 30;

export default function App() {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [items, setItems] = useState(() => createItems(DEFAULT_SIZE));
  const [algoKey, setAlgoKey] = useState("merge");

  const steps = useMemo(
    () => ALGORITHMS[algoKey].run(items),
    [algoKey, items]
  );
  const playback = usePlayback(steps);

  function handleSizeChange(event) {
    const newSize = Number(event.target.value);
    setSize(newSize);
    setItems(createItems(newSize));
  }

  function handleNewArray() {
    setItems(createItems(size));
  }

  function handleSortedArray() {
    setItems(createSortedItems(size));
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Visortr</h1>
      <p>See algorithms think.</p>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <select value={algoKey} onChange={(e) => setAlgoKey(e.target.value)}>
          {Object.entries(ALGORITHMS).map(([key, algo]) => (
            <option key={key} value={key}>
              {algo.name}
            </option>
          ))}
        </select>
        <button onClick={handleNewArray}>New array</button>
        <button onClick={handleSortedArray}>Sorted array</button>
        <label>
          Size: {size}{" "}
          <input
            type="range"
            min={5}
            max={100}
            value={size}
            onChange={handleSizeChange}
          />
        </label>
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

      <BarChart
        items={playback.step.array}
        comparing={playback.step.comparing}
        swapping={playback.step.swapping}
        sorted={playback.step.sorted}
        range={playback.step.range}
        pivot={playback.step.pivot}
        stepDelay={playback.delay}
      />
    </main>
  );
}