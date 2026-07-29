export const pullquoteRegistry = {
  name: "pullquote",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "pullquote.tsx", target: "components/ui/pullquote.tsx" }],
} as const;
