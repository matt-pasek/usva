export const colorFieldRegistry = {
  name: "color-field",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "color-field.tsx", target: "components/ui/color-field.tsx" }],
} as const;
