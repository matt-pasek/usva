export const dropdownMenuRegistry = {
  name: "dropdown-menu",
  type: "registry:ui",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  registryDependencies: ["overlay-core"],
  files: [
    { path: "dropdown-menu.tsx", target: "components/ui/dropdown-menu.tsx" },
  ],
} as const;
