import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/cnerlab/", // Keep this for GitHub Pages asset loading
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/app",
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
