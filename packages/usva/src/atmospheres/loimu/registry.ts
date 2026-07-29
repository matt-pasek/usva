export const loimuRegistry = {
  name: "loimu",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["atmospheres-core"],
  files: [
    { path: "loimu-field.ts", target: "components/ui/loimu-field.ts" },
    { path: "loimu-shader.ts", target: "components/ui/loimu-shader.ts" },
    { path: "loimu-uniforms.ts", target: "components/ui/loimu-uniforms.ts" },
    { path: "loimu.tsx", target: "components/ui/loimu.tsx" },
  ],
} as const;
