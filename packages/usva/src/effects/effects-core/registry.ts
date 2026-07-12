export const effectsCoreRegistry = {
  name: "effects-core",
  type: "registry:ui",
  dependencies: ["motion", "ogl"],
  registryDependencies: [],
  files: [
    { path: "effects-color.ts", target: "components/ui/effects-color.ts" },
    { path: "effects-glsl.ts", target: "components/ui/effects-glsl.ts" },
    { path: "effects-gl.ts", target: "components/ui/effects-gl.ts" },
    {
      path: "use-token-colors.ts",
      target: "components/ui/use-token-colors.ts",
    },
    { path: "use-gl-canvas.ts", target: "components/ui/use-gl-canvas.ts" },
  ],
} as const;
