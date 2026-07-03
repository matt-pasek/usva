"use client";
import * as React from "react";
import { cn } from "../../cn.js";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm text-ink placeholder:text-faint",
        "outline-none transition-[color,box-shadow,border-color] duration-200 ease-soft",
        "hover:border-border-strong",
        "focus-visible:border-transparent focus-visible:ring-focus",
        "aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
