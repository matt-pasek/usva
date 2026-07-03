export const tabsRegistry = {
  name: "tabs",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "tabs.tsx", target: "components/ui/tabs.tsx" }],
} as const;
