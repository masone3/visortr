export default function InfoPanel({ algo, comparisons, swaps }) {
  const { description, best, average, worst, space, note } = algo.info;

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
      <h2 style={{ marginTop: 0 }}>{algo.name}</h2>
      <p>{description}</p>

      <div style={{ display: "flex", gap: 32, margin: "12px 0" }}>
        <div>
          <strong>Comparisons:</strong> {comparisons}
        </div>
        <div>
          <strong>Swaps / moves:</strong> {swaps}
        </div>
      </div>

      <table style={{ borderCollapse: "collapse", marginBottom: 8 }}>
        <thead>
          <tr>
            {["Best", "Average", "Worst", "Space"].map((h) => (
              <th key={h} style={{ textAlign: "left", paddingRight: 24 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ paddingRight: 24 }}>{best}</td>
            <td style={{ paddingRight: 24 }}>{average}</td>
            <td style={{ paddingRight: 24 }}>{worst}</td>
            <td>{space}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>{note}</p>
    </section>
  );
}