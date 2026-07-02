import { defineConfig } from "tsup";
export default defineConfig({ entry: ["src/build-registry.ts", "src/usva.ts"], format: ["esm"], dts: true, clean: true });
