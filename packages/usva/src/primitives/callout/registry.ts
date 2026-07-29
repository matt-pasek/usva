export const calloutRegistry = {
  name: "callout",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "callout.tsx", target: "components/ui/callout.tsx" }],
} as const;
