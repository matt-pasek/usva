export const skeletonRegistry = {
  name: "skeleton",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "skeleton.tsx", target: "components/ui/skeleton.tsx" }],
} as const;
