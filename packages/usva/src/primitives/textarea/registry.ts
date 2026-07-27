export const textareaRegistry = {
  name: "textarea",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "textarea.tsx", target: "components/ui/textarea.tsx" }],
} as const;
