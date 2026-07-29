export const caseStudyHeroRegistry = {
  name: "case-study-hero",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    {
      path: "case-study-hero.tsx",
      target: "components/ui/case-study-hero.tsx",
    },
  ],
} as const;
