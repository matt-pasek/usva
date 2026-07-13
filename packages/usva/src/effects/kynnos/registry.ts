export const kynnosRegistry = {
  name: "kynnos",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["effects-core"],
  files: [
    { path: "kynnos-field.ts", target: "components/ui/kynnos-field.ts" },
    { path: "kynnos-shader.ts", target: "components/ui/kynnos-shader.ts" },
    { path: "kynnos-uniforms.ts", target: "components/ui/kynnos-uniforms.ts" },
    { path: "kynnos.tsx", target: "components/ui/kynnos.tsx" },
  ],
} as const;
