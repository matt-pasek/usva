export const checklistCardRegistry = {
  name: "checklist-card",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["card", "list"],
  files: [
    { path: "checklist-card.tsx", target: "components/ui/checklist-card.tsx" },
  ],
} as const;
