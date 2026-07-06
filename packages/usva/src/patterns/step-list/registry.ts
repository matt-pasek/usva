export const stepListRegistry = {
  name: "step-list",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "step-list.tsx", target: "components/ui/step-list.tsx" }],
} as const;
