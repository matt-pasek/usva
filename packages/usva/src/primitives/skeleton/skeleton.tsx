import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

/* One animation, not two: the sheen alone. `content-visibility` lets the
 * browser skip a skeleton that has scrolled out of view, animation included —
 * a full-page skeleton is dozens of these. */
export const skeletonVariants = cva(
  "skeleton-sheen relative block bg-sunken [content-visibility:auto]",
  {
    variants: {
      variant: {
        text: "h-4 w-full rounded-md",
        circle: "aspect-square rounded-full",
        rect: "rounded-lg",
      },
    },
    defaultVariants: { variant: "text" },
  },
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, radius, style, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(skeletonVariants({ variant }), className)}
      style={{
        width,
        height,
        ...(radius !== undefined ? { borderRadius: radius } : {}),
        ...style,
      }}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export interface SkeletonMirrorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** When false, renders children normally. Defaults to true. */
  loading?: boolean;
  label?: string;
  children: React.ReactNode;
}

/**
 * Auto-infers a skeleton from the layout it wraps: it renders your real
 * children with every leaf greyed into a shaped block, so the placeholder
 * always matches the component. One glimmer travels around the outline of the
 * whole skeleton (plus a soft sweep across it), not per block.
 */
export const SkeletonMirror = React.forwardRef<
  HTMLDivElement,
  SkeletonMirrorProps
>(
  (
    { className, loading = true, label = "Loading", children, ...props },
    ref,
  ) => {
    if (!loading) return <>{children}</>;
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(
          "skeleton-sheen relative isolate select-none rounded-2xl",
          className,
        )}
        {...props}
      >
        <div aria-hidden="true" className="skeleton-mask pointer-events-none">
          {children}
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-shimmer motion-reduce:animate-none"
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);
SkeletonMirror.displayName = "SkeletonMirror";
