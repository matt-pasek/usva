export const progressRegistry = {
  name: "progress",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "progress.tsx", target: "components/ui/progress.tsx" }],
} as const;
