export const ctaBannerRegistry = {
  name: "cta-banner",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["step-chips"],
  files: [{ path: "cta-banner.tsx", target: "components/ui/cta-banner.tsx" }],
} as const;
