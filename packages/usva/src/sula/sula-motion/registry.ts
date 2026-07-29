export const sulaMotionRegistry = {
  name: "sula-motion",
  type: "registry:ui",
  dependencies: [],
  registryDependencies: [],
  files: [
    { path: "springs.ts", target: "components/ui/springs.ts" },
    { path: "curves.ts", target: "components/ui/curves.ts" },
    { path: "energy.ts", target: "components/ui/energy.ts" },
  ],
} as const;
