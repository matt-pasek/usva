export const chipRegistry = {
  name: "chip",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "chip.tsx", target: "components/ui/chip.tsx" }],
} as const;
