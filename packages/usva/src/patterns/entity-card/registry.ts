export const entityCardRegistry = {
  name: "entity-card",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["card"],
  files: [{ path: "entity-card.tsx", target: "components/ui/entity-card.tsx" }],
} as const;
