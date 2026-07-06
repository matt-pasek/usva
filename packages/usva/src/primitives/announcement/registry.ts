export const announcementRegistry = {
  name: "announcement",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  registryDependencies: [],
  files: [
    { path: "announcement.tsx", target: "components/ui/announcement.tsx" },
  ],
} as const;
