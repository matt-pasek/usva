export const panelRegistry = {
  name: "panel",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["card", "spinner"],
  files: [{ path: "panel.tsx", target: "components/ui/panel.tsx" }],
} as const;
