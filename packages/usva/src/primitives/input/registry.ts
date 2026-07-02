export const inputRegistry = {
  name: "input",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "input.tsx", target: "components/ui/input.tsx" }],
} as const;
