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
    <main style={{ padding: 24 }}>
      <h1>Visortr</h1>
      <p>See algorithms think.</p>

      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {VIEWS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setView(key)}
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

      {view === "sorting" ? <SortingView /> : <PathfindingView />}
    </main>
  );
}