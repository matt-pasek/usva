export const stepChipsRegistry = {
  name: "step-chips",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "step-chips.tsx", target: "components/ui/step-chips.tsx" }],
} as const;
