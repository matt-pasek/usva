export const statBentoRegistry = {
  name: "stat-bento",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["bento-grid"],
  files: [{ path: "stat-bento.tsx", target: "components/ui/stat-bento.tsx" }],
} as const;
