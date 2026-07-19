export const revealRegistry = {
  name: "reveal",
  type: "registry:ui",
  dependencies: ["motion", "@matt-pasek/usva-tokens"],
  registryDependencies: [],
  files: [
    { path: "reveal.tsx", target: "components/ui/reveal.tsx" },
    { path: "reveal-config.tsx", target: "components/ui/reveal-config.tsx" },
    { path: "presets.ts", target: "components/ui/presets.ts" },
  ],
} as const;
