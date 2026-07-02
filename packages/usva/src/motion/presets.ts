import { tokens } from "@matt-pasek/usva-tokens";

export const springs = tokens.motion.spring;

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: springs.soft },
  },
  stagger: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  },
} as const;
