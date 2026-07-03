export const cardRegistry = {
  name: "card",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["badge"],
  files: [{ path: "card.tsx", target: "components/ui/card.tsx" }],
} as const;
