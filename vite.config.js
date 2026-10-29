import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pass `--mode pages` when building for GitHub Pages, which serves the
// site from a subfolder (/visortr/). Every other build uses the root.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "pages" ? "/visortr/" : "/",
}));