export const sulaNavRegistry = {
  name: "sula-nav",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["sula-motion", "sula-core"],
  files: [
    { path: "nav-geometry.ts", target: "components/ui/nav-geometry.ts" },
    { path: "sula-nav.tsx", target: "components/ui/sula-nav.tsx" },
  ],
} as const;
