export const listRegistry = {
  name: "list",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "list.tsx", target: "components/ui/list.tsx" }],
} as const;
