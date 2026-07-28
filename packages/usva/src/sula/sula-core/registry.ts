export const sulaCoreRegistry = {
  name: "sula-core",
  type: "registry:ui",
  dependencies: ["ogl"],
  registryDependencies: ["sula-motion"],
  files: [
    { path: "geometry.ts", target: "components/ui/geometry.ts" },
    { path: "pause.ts", target: "components/ui/pause.ts" },
    { path: "shader.ts", target: "components/ui/shader.ts" },
    { path: "field.ts", target: "components/ui/field.ts" },
    { path: "emerge.ts", target: "components/ui/emerge.ts" },
    { path: "border-shader.ts", target: "components/ui/border-shader.ts" },
    { path: "border.ts", target: "components/ui/border.ts" },
    { path: "recovery.ts", target: "components/ui/recovery.ts" },
  ],
} as const;
