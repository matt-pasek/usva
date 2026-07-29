export const toggleChipRegistry = {
  name: "toggle-chip",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "toggle-chip.tsx", target: "components/ui/toggle-chip.tsx" }],
} as const;
