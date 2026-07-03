"use client";
import { Avatar as Base } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

const rootVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const fallbackVariants = cva(
  "flex h-full w-full items-center justify-center bg-surface-2 font-medium text-muted",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface AvatarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Base.Root>,
      "render" | "className"
    >,
    VariantProps<typeof rootVariants> {
  className?: string;
  src?: string;
  alt: string;
  fallback?: string;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, fallback, size, ...props }, ref) => {
    return (
      <Base.Root
        ref={ref}
        className={cn(rootVariants({ size }), className)}
        {...props}
      >
        {src ? (
          <Base.Image
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : null}
        <Base.Fallback className={fallbackVariants({ size })}>
          {fallback}
        </Base.Fallback>
      </Base.Root>
    );
  },
);
Avatar.displayName = "Avatar";
