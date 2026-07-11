export const sulaSegmentedRegistry = {
  name: "sula-segmented",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["sula-motion", "sula-core"],
  files: [
    {
      path: "segmented-geometry.ts",
      target: "components/ui/segmented-geometry.ts",
    },
    { path: "sula-segmented.tsx", target: "components/ui/sula-segmented.tsx" },
  ],
} as const;
