export const utuSphereRegistry = {
  name: "utu-sphere",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["effects-core"],
  files: [
    { path: "sphere-geometry.ts", target: "components/ui/sphere-geometry.ts" },
    { path: "sphere-shader.ts", target: "components/ui/sphere-shader.ts" },
    { path: "sphere.ts", target: "components/ui/sphere.ts" },
    { path: "utu-sphere.tsx", target: "components/ui/utu-sphere.tsx" },
  ],
} as const;
