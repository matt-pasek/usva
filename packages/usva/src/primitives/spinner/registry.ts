export const spinnerRegistry = {
  name: "spinner",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "spinner.tsx", target: "components/ui/spinner.tsx" }],
} as const;
