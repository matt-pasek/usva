"use client";

import * as React from "react";
import { cn } from "../../cn.js";

export interface SkeletonGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SkeletonGroup = React.forwardRef<
  HTMLDivElement,
  SkeletonGroupProps
>(({ className, children, ...props }, ref) => {
  const groupRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => groupRef.current as HTMLDivElement, []);

  React.useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const skeletons = new Set<HTMLElement>();

    const measure = () => {
      const groupRect = group.getBoundingClientRect();
      group.style.setProperty(
        "--usva-skeleton-group-width",
        `${groupRect.width}px`,
      );
      group.style.setProperty(
        "--usva-skeleton-group-height",
        `${groupRect.height}px`,
      );

      for (const skeleton of skeletons) {
        const skeletonRect = skeleton.getBoundingClientRect();
        skeleton.style.setProperty(
          "--usva-skeleton-offset-x",
          `${skeletonRect.left - groupRect.left}px`,
        );
        skeleton.style.setProperty(
          "--usva-skeleton-offset-y",
          `${skeletonRect.top - groupRect.top}px`,
        );
      }
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    resizeObserver?.observe(group);

    const syncSkeletons = () => {
      const next = new Set(
        Array.from(
          group.querySelectorAll<HTMLElement>("[data-usva-skeleton]"),
        ).filter(
          (skeleton) => skeleton.closest("[data-skeleton-group]") === group,
        ),
      );

      for (const skeleton of skeletons) {
        if (next.has(skeleton)) continue;
        resizeObserver?.unobserve(skeleton);
        delete skeleton.dataset.skeletonGrouped;
        skeleton.style.removeProperty("--usva-skeleton-offset-x");
        skeleton.style.removeProperty("--usva-skeleton-offset-y");
        skeletons.delete(skeleton);
      }

      for (const skeleton of next) {
        if (skeletons.has(skeleton)) continue;
        skeletons.add(skeleton);
        skeleton.dataset.skeletonGrouped = "";
        resizeObserver?.observe(skeleton);
      }

      measure();
    };

    syncSkeletons();

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(syncSkeletons);
    mutationObserver?.observe(group, { childList: true, subtree: true });
    window.addEventListener("resize", measure);

    return () => {
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure);
      group.style.removeProperty("--usva-skeleton-group-width");
      group.style.removeProperty("--usva-skeleton-group-height");
      for (const skeleton of skeletons) {
        delete skeleton.dataset.skeletonGrouped;
        skeleton.style.removeProperty("--usva-skeleton-offset-x");
        skeleton.style.removeProperty("--usva-skeleton-offset-y");
      }
    };
  }, []);

  return (
    <div
      ref={groupRef}
      data-skeleton-group=""
      className={cn("skeleton-group", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SkeletonGroup.displayName = "SkeletonGroup";
