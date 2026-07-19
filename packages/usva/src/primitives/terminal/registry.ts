export const terminalRegistry = {
  name: "terminal",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["code-snippet"],
  files: [{ path: "terminal.tsx", target: "components/ui/terminal.tsx" }],
} as const;
