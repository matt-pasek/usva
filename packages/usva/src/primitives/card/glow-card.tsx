"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import { Card, type CardProps } from "./card.js";

/**
 * A Card whose border lights up on the edge facing the pointer. The arc turns
 * to follow the cursor and brightens as you approach the edge, so a single card
 * gets the same directional glow the BentoGrid shares across a whole grid.
 */
export const GlowCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const onPointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        const el = localRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--edge-x", `${e.clientX - r.left}px`);
        el.style.setProperty("--edge-y", `${e.clientY - r.top}px`);
        el.style.setProperty("--edge-o", "1");
      },
      [],
    );

    const onPointerLeave = React.useCallback(() => {
      localRef.current?.style.setProperty("--edge-o", "0");
    }, []);

    return (
      <Card
        ref={setRefs}
        className={cn("relative", className)}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        {...props}
      >
        <span aria-hidden className="edge-glow" />
        {children}
      </Card>
    );
  },
);
GlowCard.displayName = "GlowCard";
