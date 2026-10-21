import { ALGORITHMS } from "../algorithms";

export default function Toolbar({
  algoKey,
  size,
  onAlgoChange,
  onSizeChange,
  onNewArray,
  onSortedArray,
}) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <select value={algoKey} onChange={(e) => onAlgoChange(e.target.value)}>
        {Object.entries(ALGORITHMS).map(([key, algo]) => (
          <option key={key} value={key}>
            {algo.name}
          </option>
        ))}
      </select>
      <button onClick={onNewArray}>New array</button>
      <button onClick={onSortedArray}>Sorted array</button>
      <label>
        Size: {size}{" "}
        <input
          type="range"
          min={5}
          max={100}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
        />
      </label>
    </div>
  );
}