export const tooltipRegistry = {
  name: "tooltip",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: ["overlay-core"],
  files: [{ path: "tooltip.tsx", target: "components/ui/tooltip.tsx" }],
} as const;
