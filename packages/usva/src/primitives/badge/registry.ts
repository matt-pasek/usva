export const badgeRegistry = {
  name: "badge",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "badge.tsx", target: "components/ui/badge.tsx" }],
} as const;
