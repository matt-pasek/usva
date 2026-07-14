export const atmospheresCoreRegistry = {
  name: "atmospheres-core",
  type: "registry:ui",
  dependencies: ["motion", "ogl"],
  registryDependencies: [],
  files: [
    {
      path: "atmospheres-color.ts",
      target: "components/ui/atmospheres-color.ts",
    },
    {
      path: "atmospheres-glsl.ts",
      target: "components/ui/atmospheres-glsl.ts",
    },
    { path: "atmospheres-gl.ts", target: "components/ui/atmospheres-gl.ts" },
    {
      path: "use-token-colors.ts",
      target: "components/ui/use-token-colors.ts",
    },
    { path: "use-gl-canvas.ts", target: "components/ui/use-gl-canvas.ts" },
  ],
} as const;
