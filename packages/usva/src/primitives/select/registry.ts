export const selectRegistry = {
  name: "select",
  type: "registry:ui",
  dependencies: [
    "@base-ui/react",
    "@matt-pasek/usva-tokens",
    "clsx",
    "tailwind-merge",
  ],
  registryDependencies: [],
  files: [{ path: "select.tsx", target: "components/ui/select.tsx" }],
} as const;
