export const hehkuRegistry = {
  name: "hehku",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["atmospheres-core"],
  files: [
    { path: "filament-curve.ts", target: "components/ui/filament-curve.ts" },
    { path: "filament-shader.ts", target: "components/ui/filament-shader.ts" },
    { path: "filament.ts", target: "components/ui/filament.ts" },
    { path: "hehku.tsx", target: "components/ui/hehku.tsx" },
  ],
} as const;
