export const buttonRegistry = {
  name: "button",
  type: "registry:ui",
  dependencies: [
    "motion",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
  registryDependencies: ["spinner"],
  files: [{ path: "button.tsx", target: "components/ui/button.tsx" }],
} as const;
