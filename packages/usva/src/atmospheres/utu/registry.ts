export const utuRegistry = {
  name: "utu",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["atmospheres-core"],
  files: [
    { path: "utu-field.ts", target: "components/ui/utu-field.ts" },
    { path: "utu-shader.ts", target: "components/ui/utu-shader.ts" },
    { path: "utu-uniforms.ts", target: "components/ui/utu-uniforms.ts" },
    { path: "utu.tsx", target: "components/ui/utu.tsx" },
  ],
} as const;
