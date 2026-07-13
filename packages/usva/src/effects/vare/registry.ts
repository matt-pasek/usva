export const vareRegistry = {
  name: "vare",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["effects-core"],
  files: [
    { path: "vare-field.ts", target: "components/ui/vare-field.ts" },
    { path: "vare-shader.ts", target: "components/ui/vare-shader.ts" },
    { path: "vare-uniforms.ts", target: "components/ui/vare-uniforms.ts" },
    { path: "vare.tsx", target: "components/ui/vare.tsx" },
  ],
} as const;
