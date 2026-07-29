export const featureCarouselRegistry = {
  name: "feature-carousel",
  type: "registry:ui",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    {
      path: "feature-carousel.tsx",
      target: "components/ui/feature-carousel.tsx",
    },
  ],
} as const;
