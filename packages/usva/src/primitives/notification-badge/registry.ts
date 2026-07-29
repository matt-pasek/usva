export const notificationBadgeRegistry = {
  name: "notification-badge",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    {
      path: "notification-badge.tsx",
      target: "components/ui/notification-badge.tsx",
    },
  ],
} as const;
