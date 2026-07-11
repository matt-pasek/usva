export const sulaNavRegistry = {
  name: "sula-nav",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["sula-motion"],
  files: [
    { path: "nav-geometry.ts", target: "components/ui/nav-geometry.ts" },
    { path: "nav-shader.ts", target: "components/ui/nav-shader.ts" },
    { path: "nav-field.ts", target: "components/ui/nav-field.ts" },
    { path: "sula-nav.tsx", target: "components/ui/sula-nav.tsx" },
  ],
} as const;
