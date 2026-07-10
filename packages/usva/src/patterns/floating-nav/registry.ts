export const floatingNavRegistry = {
  name: "floating-nav",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "nav-geometry.ts", target: "components/ui/nav-geometry.ts" },
    { path: "nav-shader.ts", target: "components/ui/nav-shader.ts" },
    { path: "nav-field.ts", target: "components/ui/nav-field.ts" },
    { path: "floating-nav.tsx", target: "components/ui/floating-nav.tsx" },
  ],
} as const;
