export const pageHeaderRegistry = {
  name: "page-header",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "page-header.tsx", target: "components/ui/page-header.tsx" }],
} as const;
