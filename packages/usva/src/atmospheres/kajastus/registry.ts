export const kajastusRegistry = {
  name: "kajastus",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["atmospheres-core"],
  files: [
    {
      path: "kajastus-uniforms.ts",
      target: "components/ui/kajastus-uniforms.ts",
    },
    { path: "kajastus-shader.ts", target: "components/ui/kajastus-shader.ts" },
    { path: "kajastus.tsx", target: "components/ui/kajastus.tsx" },
  ],
} as const;
