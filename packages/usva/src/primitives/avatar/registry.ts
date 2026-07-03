export const avatarRegistry = {
  name: "avatar",
  type: "registry:ui",
  dependencies: [
    "@base-ui/react",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
  ],
  registryDependencies: [],
  files: [{ path: "avatar.tsx", target: "components/ui/avatar.tsx" }],
} as const;
