export const progressRowRegistry = {
  name: "progress-row",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "progress-row.tsx", target: "components/ui/progress-row.tsx" },
  ],
} as const;
