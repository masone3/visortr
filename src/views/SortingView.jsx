import { useMemo, useState } from "react";
import BarChart from "../components/BarChart";
import Controls from "../components/Controls";
import InfoPanel from "../components/InfoPanel";
import Legend from "../components/Legend";
import Toolbar from "../components/Toolbar";
import { usePlayback } from "../hooks/usePlayback";
import { ALGORITHMS } from "../algorithms";
import { createItems, createSortedItems } from "../utils/array";
import { computeStats } from "../utils/stats";

const DEFAULT_SIZE = 30;

export default function SortingView() {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [items, setItems] = useState(() => createItems(DEFAULT_SIZE));
  const [algoKey, setAlgoKey] = useState("merge");

  const algo = ALGORITHMS[algoKey];
  const steps = useMemo(() => algo.run(items), [algo, items]);
  const stats = useMemo(() => computeStats(steps), [steps]);
  const playback = usePlayback(steps);

  const current = stats[Math.min(playback.index, playback.last)];

  function handleSizeChange(newSize) {
    setSize(newSize);
    setItems(createItems(newSize));
  }

  return (
    <>
      <Toolbar
        algoKey={algoKey}
        size={size}
        onAlgoChange={setAlgoKey}
        onSizeChange={handleSizeChange}
        onNewArray={() => setItems(createItems(size))}
        onSortedArray={() => setItems(createSortedItems(size))}
      />

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

      <Legend />

      <BarChart
        items={playback.step.array}
        comparing={playback.step.comparing}
        swapping={playback.step.swapping}
        sorted={playback.step.sorted}
        range={playback.step.range}
        pivot={playback.step.pivot}
        stepDelay={playback.delay}
      />

      <InfoPanel
        algo={algo}
        comparisons={current.comparisons}
        swaps={current.swaps}
      />
    </>
  );
}