import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [moved, setMoved] = useState(false);

  return (
    <main style={{ padding: 24 }}>
      <h1>Visortr</h1>
      <p>See algorithms think.</p>

      <button onClick={() => setMoved((m) => !m)}>Move the bar</button>

      <svg width="400" height="120" style={{ display: "block", marginTop: 16 }}>
        <motion.rect
          y={20}
          width={40}
          height={80}
          rx={4}
          fill="#38bdf8"
          animate={{ x: moved ? 300 : 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      </svg>
    </main>
  );
}