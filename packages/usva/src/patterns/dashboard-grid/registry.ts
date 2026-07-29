export const dashboardGridRegistry = {
  name: "dashboard-grid",
  type: "registry:ui",
  dependencies: ["@dnd-kit/core", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "grid-layout.ts", target: "components/ui/grid-layout.ts" },
    { path: "dashboard-grid.tsx", target: "components/ui/dashboard-grid.tsx" },
  ],
} as const;
