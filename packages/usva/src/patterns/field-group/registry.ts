export const fieldGroupRegistry = {
  name: "field-group",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["label"],
  files: [{ path: "field-group.tsx", target: "components/ui/field-group.tsx" }],
} as const;
