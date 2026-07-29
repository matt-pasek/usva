export const emptyStateRegistry = {
  name: "empty-state",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "empty-state.tsx", target: "components/ui/empty-state.tsx" }],
} as const;
