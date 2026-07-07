export const drawerRegistry = {
  name: "drawer",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: ["card"],
  files: [{ path: "drawer.tsx", target: "components/ui/drawer.tsx" }],
} as const;
