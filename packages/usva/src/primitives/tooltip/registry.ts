export const tooltipRegistry = {
  name: "tooltip",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "tooltip.tsx", target: "components/ui/tooltip.tsx" }],
} as const;
