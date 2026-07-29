export const selectRegistry = {
  name: "select",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: ["overlay-core"],
  files: [{ path: "select.tsx", target: "components/ui/select.tsx" }],
} as const;
