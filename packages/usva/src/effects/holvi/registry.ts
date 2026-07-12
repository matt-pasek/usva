export const holviRegistry = {
  name: "holvi",
  type: "registry:ui",
  dependencies: ["clsx", "motion", "ogl", "tailwind-merge"],
  registryDependencies: ["effects-core"],
  files: [
    { path: "vault.ts", target: "components/ui/vault.ts" },
    { path: "vault-shader.ts", target: "components/ui/vault-shader.ts" },
    { path: "holvi.tsx", target: "components/ui/holvi.tsx" },
  ],
} as const;
