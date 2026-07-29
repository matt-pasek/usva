export const loadingOverlayRegistry = {
  name: "loading-overlay",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["spinner"],
  files: [
    {
      path: "loading-overlay.tsx",
      target: "components/ui/loading-overlay.tsx",
    },
    {
      path: "use-scroll-lock.ts",
      target: "components/ui/use-scroll-lock.ts",
    },
  ],
} as const;
