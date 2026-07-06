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
  files: [
    { path: "avatar.tsx", target: "components/ui/avatar.tsx" },
    { path: "avatar-group.tsx", target: "components/ui/avatar-group.tsx" },
  ],
} as const;
