export const buttonRegistry = {
  name: "button",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "button.tsx", target: "components/ui/button.tsx" }],
} as const;
