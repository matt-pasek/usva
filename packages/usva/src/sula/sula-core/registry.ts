export const sulaCoreRegistry = {
  name: "sula-core",
  type: "registry:ui",
  dependencies: ["ogl"],
  registryDependencies: ["sula-motion"],
  files: [
    { path: "geometry.ts", target: "components/ui/geometry.ts" },
    { path: "shader.ts", target: "components/ui/shader.ts" },
    { path: "field.ts", target: "components/ui/field.ts" },
    { path: "emerge.ts", target: "components/ui/emerge.ts" },
  ],
} as const;
