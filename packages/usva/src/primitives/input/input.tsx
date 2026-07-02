"use client";
import * as React from "react";
import { cn } from "../../cn.js";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-faint",
        "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        "aria-invalid:border-danger aria-invalid:ring-danger",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
