export const switchRegistry = {
  name: "switch",
  type: "registry:ui",
  dependencies: [
    "@base-ui/react",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
  ],
  registryDependencies: [],
  files: [{ path: "switch.tsx", target: "components/ui/switch.tsx" }],
} as const;
