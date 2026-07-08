export const roadmapTimelineRegistry = {
  name: "roadmap-timeline",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    {
      path: "roadmap-timeline.tsx",
      target: "components/ui/roadmap-timeline.tsx",
    },
  ],
} as const;
