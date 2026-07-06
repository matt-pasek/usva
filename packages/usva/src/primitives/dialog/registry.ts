export const dialogRegistry = {
  name: "dialog",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: ["card"],
  files: [{ path: "dialog.tsx", target: "components/ui/dialog.tsx" }],
} as const;
