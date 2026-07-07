export const logLineRegistry = {
  name: "log-line",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "log-line.tsx", target: "components/ui/log-line.tsx" }],
} as const;
