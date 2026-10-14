import { useState } from "react";
import BarChart from "./components/BarChart";
import { generateRandomArray } from "./utils/array";

const DEFAULT_SIZE = 30;

export default function App() {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [values, setValues] = useState(() => generateRandomArray(DEFAULT_SIZE));

  function handleSizeChange(event) {
    const newSize = Number(event.target.value);
    setSize(newSize);
    setValues(generateRandomArray(newSize));
  }

  function handleNewArray() {
    setValues(generateRandomArray(size));
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Visortr</h1>
      <p>See algorithms think.</p>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <button onClick={handleNewArray}>New array</button>
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

      <BarChart values={values} />
    </main>
  );
}