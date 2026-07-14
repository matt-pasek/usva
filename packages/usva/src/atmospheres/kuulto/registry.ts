export const kuultoRegistry = {
  name: "kuulto",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["atmospheres-core"],
  files: [
    { path: "kuulto-field.ts", target: "components/ui/kuulto-field.ts" },
    { path: "kuulto-shader.ts", target: "components/ui/kuulto-shader.ts" },
    { path: "kuulto-uniforms.ts", target: "components/ui/kuulto-uniforms.ts" },
    { path: "kuulto.tsx", target: "components/ui/kuulto.tsx" },
  ],
} as const;
