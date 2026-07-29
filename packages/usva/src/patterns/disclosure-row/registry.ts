export const disclosureRowRegistry = {
  name: "disclosure-row",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "disclosure-row.tsx", target: "components/ui/disclosure-row.tsx" },
  ],
} as const;
