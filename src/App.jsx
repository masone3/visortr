import { useState } from "react";
import SortingView from "./views/SortingView";
import PathfindingView from "./views/PathfindingView";

const VIEWS = [
  { key: "sorting", label: "Sorting" },
  { key: "pathfinding", label: "Pathfinding" },
];

export default function App() {
  const [view, setView] = useState("sorting");

  return (
    <main className="app">
      <h1>Visortr</h1>
      <p>See algorithms think.</p>

      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {VIEWS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            aria-pressed={view === key}
            style={{
              background: view === key ? "#38bdf8" : undefined,
              color: view === key ? "#0f172a" : undefined,
              fontWeight: view === key ? "bold" : "normal",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <div hidden={view !== "sorting"}>
        <SortingView active={view === "sorting"} />
      </div>
      <div hidden={view !== "pathfinding"}>
        <PathfindingView active={view === "pathfinding"} />
      </div>
    </main>
  );
}