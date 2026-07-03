export const checkboxRegistry = {
  name: "checkbox",
  type: "registry:ui",
  dependencies: [
    "@base-ui/react",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
  ],
  registryDependencies: [],
  files: [{ path: "checkbox.tsx", target: "components/ui/checkbox.tsx" }],
} as const;
