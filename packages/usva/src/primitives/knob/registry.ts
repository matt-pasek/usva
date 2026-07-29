export const knobRegistry = {
  name: "knob",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge", "class-variance-authority"],
  registryDependencies: [],
  files: [
    { path: "knob-geometry.ts", target: "components/ui/knob-geometry.ts" },
    { path: "use-knob-value.ts", target: "components/ui/use-knob-value.ts" },
    { path: "knob.tsx", target: "components/ui/knob.tsx" },
  ],
} as const;
