export const cardRegistry = {
  name: "card",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["badge"],
  files: [
    { path: "card.tsx", target: "components/ui/card.tsx" },
    { path: "glow-card.tsx", target: "components/ui/glow-card.tsx" },
  ],
} as const;
