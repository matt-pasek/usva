export const pageTransitionRegistry = {
  name: "page-transition",
  type: "registry:ui",
  dependencies: ["motion"],
  registryDependencies: [],
  files: [
    {
      path: "page-transition.tsx",
      target: "components/ui/page-transition.tsx",
    },
  ],
} as const;
