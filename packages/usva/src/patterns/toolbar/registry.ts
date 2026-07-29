export const toolbarRegistry = {
  name: "toolbar",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "toolbar.tsx", target: "components/ui/toolbar.tsx" }],
} as const;
