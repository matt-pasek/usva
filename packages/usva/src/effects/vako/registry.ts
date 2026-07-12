export const vakoRegistry = {
  name: "vako",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["effects-core"],
  files: [
    { path: "vako-field.ts", target: "components/ui/vako-field.ts" },
    { path: "vako-shader.ts", target: "components/ui/vako-shader.ts" },
    { path: "vako-uniforms.ts", target: "components/ui/vako-uniforms.ts" },
    { path: "vako.tsx", target: "components/ui/vako.tsx" },
  ],
} as const;
