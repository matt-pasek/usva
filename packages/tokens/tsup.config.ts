import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts", "src/preset.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
});
