import { cn } from "@usva-ui/react/cn";
import type * as React from "react";

/**
 * The section heading register for long-form pages: design-language chapters
 * and theme pages. Named for the chapter shell it started in, and kept
 * distinct from usva's own SectionHeading pattern, which is a different
 * component with an eyebrow and a description slot.
 */
export function ChapterHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("font-bold text-ink text-xl tracking-tight", className)}>
      {children}
    </h2>
  );
}
