export const heroSplitRegistry = {
  name: "hero-split",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "hero-split.tsx", target: "components/ui/hero-split.tsx" }],
} as const;
