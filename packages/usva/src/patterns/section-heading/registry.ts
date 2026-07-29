export const sectionHeadingRegistry = {
  name: "section-heading",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    {
      path: "section-heading.tsx",
      target: "components/ui/section-heading.tsx",
    },
  ],
} as const;
