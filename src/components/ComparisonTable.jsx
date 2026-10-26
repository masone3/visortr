export default function ComparisonTable({ results, activeKey }) {
  const cell = { padding: "4px 24px 4px 0", textAlign: "left" };

  return (
    <section
      style={{
        marginTop: 16,
        padding: 16,
        maxWidth: 800,
        background: "#1e293b",
        borderRadius: 8,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Compare on this board</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={cell}>Algorithm</th>
              <th style={cell}>Cells visited</th>
              <th style={cell}>Path length</th>
              <th style={cell}>Path cost</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr
                key={r.key}
                style={{
                  fontWeight: r.key === activeKey ? "bold" : "normal",
                  color: r.key === activeKey ? "#38bdf8" : undefined,
                }}
              >
                <td style={cell}>{r.name}</td>
                <td style={cell}>{r.visited}</td>
                <td style={cell}>{r.found ? r.length : "no path"}</td>
                <td style={cell}>{r.found ? r.cost : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.8 }}>
        Each algorithm runs to completion on the current walls, weights, start,
        and end. Edit the board and the numbers update.
      </p>
    </section>
  );
}