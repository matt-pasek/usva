export const statChipRegistry = {
  name: "stat-chip",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "stat-chip.tsx", target: "components/ui/stat-chip.tsx" }],
} as const;
