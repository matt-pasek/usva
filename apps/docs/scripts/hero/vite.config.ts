import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: here("."),
  plugins: [tailwindcss()],
  resolve: {
    alias: { "@": here("../../") },
    // packages/usva/dist resolves its own react under the hoisted linker, which
    // gives the harness two copies and a null dispatcher inside every hook.
    dedupe: ["react", "react-dom", "motion", "motion/react"],
  },
  esbuild: { jsx: "automatic" },
  base: "./",
  build: { outDir: here(".dist"), emptyOutDir: true },
});
