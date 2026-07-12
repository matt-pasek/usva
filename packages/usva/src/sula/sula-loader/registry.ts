export const sulaLoaderRegistry = {
  name: "sula-loader",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["sula-motion", "sula-core"],
  files: [
    { path: "loader-geometry.ts", target: "components/ui/loader-geometry.ts" },
    { path: "sula-loader.tsx", target: "components/ui/sula-loader.tsx" },
  ],
} as const;
