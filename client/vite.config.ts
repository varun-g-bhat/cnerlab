import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/cnerlab/", // Updated to match your repository name
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
