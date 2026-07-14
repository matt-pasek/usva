export const sliderRegistry = {
  name: "slider",
  type: "registry:ui",
  dependencies: [
    "@base-ui/react",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
  ],
  registryDependencies: [],
  files: [{ path: "slider.tsx", target: "components/ui/slider.tsx" }],
} as const;
