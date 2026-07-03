import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export const skeletonVariants = cva(
  "block bg-surface-2 animate-shimmer motion-reduce:animate-none",
  {
    variants: {
      variant: {
        text: "h-4 w-full rounded-md",
        circle: "aspect-square rounded-full",
        rect: "rounded-md",
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
