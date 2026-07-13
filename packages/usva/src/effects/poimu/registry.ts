export const poimuRegistry = {
  name: "poimu",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["effects-core"],
  files: [
    { path: "poimu-field.ts", target: "components/ui/poimu-field.ts" },
    { path: "poimu-shader.ts", target: "components/ui/poimu-shader.ts" },
    { path: "poimu-uniforms.ts", target: "components/ui/poimu-uniforms.ts" },
    { path: "poimu.tsx", target: "components/ui/poimu.tsx" },
  ],
} as const;
