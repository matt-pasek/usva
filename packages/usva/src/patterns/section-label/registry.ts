export const sectionLabelRegistry = {
  name: "section-label",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "section-label.tsx", target: "components/ui/section-label.tsx" },
  ],
} as const;
