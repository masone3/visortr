import { COLORS } from "./BarChart";

const ENTRIES = [
  { key: "default", label: "Unsorted" },
  { key: "comparing", label: "Comparing" },
  { key: "swapping", label: "Swapping / moving" },
  { key: "pivot", label: "Pivot" },
  { key: "sorted", label: "Sorted" },
];

export default function Legend() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, margin: "12px 0" }}>
      {ENTRIES.map(({ key, label }) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: COLORS[key],
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 14 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}