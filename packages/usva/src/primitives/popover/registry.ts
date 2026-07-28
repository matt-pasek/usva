export const popoverRegistry = {
  name: "popover",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: ["overlay-core"],
  files: [{ path: "popover.tsx", target: "components/ui/popover.tsx" }],
} as const;
