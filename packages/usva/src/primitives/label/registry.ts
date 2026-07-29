export const labelRegistry = {
  name: "label",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "label.tsx", target: "components/ui/label.tsx" }],
} as const;
