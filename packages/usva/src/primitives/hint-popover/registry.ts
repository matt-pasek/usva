export const hintPopoverRegistry = {
  name: "hint-popover",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "hint-popover.tsx", target: "components/ui/hint-popover.tsx" },
  ],
} as const;
