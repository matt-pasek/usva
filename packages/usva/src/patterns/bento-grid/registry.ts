export const bentoGridRegistry = {
  name: "bento-grid",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["card"],
  files: [{ path: "bento-grid.tsx", target: "components/ui/bento-grid.tsx" }],
} as const;
