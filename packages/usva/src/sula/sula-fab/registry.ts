export const sulaFabRegistry = {
  name: "sula-fab",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["sula-motion", "sula-core"],
  files: [
    { path: "fab-geometry.ts", target: "components/ui/fab-geometry.ts" },
    { path: "sula-fab.tsx", target: "components/ui/sula-fab.tsx" },
  ],
} as const;
