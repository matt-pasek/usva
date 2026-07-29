export const statCardRegistry = {
  name: "stat-card",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["card"],
  files: [{ path: "stat-card.tsx", target: "components/ui/stat-card.tsx" }],
} as const;
