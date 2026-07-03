export const dialogRegistry = {
  name: "dialog",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "dialog.tsx", target: "components/ui/dialog.tsx" }],
} as const;
