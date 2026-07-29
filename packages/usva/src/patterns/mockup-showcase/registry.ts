export const mockupShowcaseRegistry = {
  name: "mockup-showcase",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    {
      path: "mockup-showcase.tsx",
      target: "components/ui/mockup-showcase.tsx",
    },
  ],
} as const;
