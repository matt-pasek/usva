export const sulaFieldRegistry = {
  name: "sula-field",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["sula-motion", "sula-core"],
  files: [
    { path: "field-geometry.ts", target: "components/ui/field-geometry.ts" },
    { path: "sula-field.tsx", target: "components/ui/sula-field.tsx" },
  ],
} as const;
