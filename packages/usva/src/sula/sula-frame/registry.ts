export const sulaFrameRegistry = {
  name: "sula-frame",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["sula-motion", "sula-core"],
  files: [
    { path: "frame-geometry.ts", target: "components/ui/frame-geometry.ts" },
    { path: "sula-frame.tsx", target: "components/ui/sula-frame.tsx" },
  ],
} as const;
