export const iconButtonRegistry = {
  name: "icon-button",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: ["spinner"],
  files: [{ path: "icon-button.tsx", target: "components/ui/icon-button.tsx" }],
} as const;
