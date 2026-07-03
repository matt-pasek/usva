export const radioRegistry = {
  name: "radio",
  type: "registry:ui",
  dependencies: [
    "@base-ui/react",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
  ],
  registryDependencies: [],
  files: [{ path: "radio.tsx", target: "components/ui/radio.tsx" }],
} as const;
