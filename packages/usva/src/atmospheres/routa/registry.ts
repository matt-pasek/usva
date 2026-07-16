export const routaRegistry = {
  name: "routa",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["atmospheres-core"],
  files: [
    { path: "routa-field.ts", target: "components/ui/routa-field.ts" },
    { path: "routa-shader.ts", target: "components/ui/routa-shader.ts" },
    { path: "routa-uniforms.ts", target: "components/ui/routa-uniforms.ts" },
    { path: "routa.tsx", target: "components/ui/routa.tsx" },
  ],
} as const;
