"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type * as React from "react";

export interface PageTransitionProps {
  /** Change this per route (e.g. the pathname) to trigger the transition. */
  routeKey: string;
  children: React.ReactNode;
}

/**
 * Framework-neutral route transition: fade and lift in, soft lift out. Pass the
 * current route as `routeKey` (e.g. `usePathname()` in Next, `location.pathname`
 * elsewhere). Collapses to a plain render under reduced motion.
 */
export function PageTransition({ routeKey, children }: PageTransitionProps) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        }}
        exit={{
          opacity: 0,
          y: -12,
          transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
