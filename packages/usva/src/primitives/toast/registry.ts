export const toastRegistry = {
  name: "toast",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "toast.tsx", target: "components/ui/toast.tsx" }],
} as const;
