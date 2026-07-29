export const stripeCardRegistry = {
  name: "stripe-card",
  type: "registry:ui",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["card"],
  files: [{ path: "stripe-card.tsx", target: "components/ui/stripe-card.tsx" }],
} as const;
