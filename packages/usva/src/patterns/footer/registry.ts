export const footerRegistry = {
  name: "footer",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [{ path: "footer.tsx", target: "components/ui/footer.tsx" }],
} as const;
