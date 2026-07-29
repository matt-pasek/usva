export const skeletonRegistry = {
  name: "skeleton",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "skeleton.tsx", target: "components/ui/skeleton.tsx" },
    {
      path: "skeleton-group.tsx",
      target: "components/ui/skeleton-group.tsx",
    },
  ],
} as const;
