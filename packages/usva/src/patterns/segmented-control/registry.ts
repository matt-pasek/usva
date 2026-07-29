export const segmentedControlRegistry = {
  name: "segmented-control",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    {
      path: "segmented-control.tsx",
      target: "components/ui/segmented-control.tsx",
    },
  ],
} as const;
