import * as React from "react";
import { cn } from "../../cn.js";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  mono?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, disabled, mono, ...props }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: reusable label primitive; htmlFor/content supplied by consumers
    <label
      ref={ref}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "select-none text-[13px] font-medium leading-none text-ink",
        mono ? "font-mono" : "font-sans",
        disabled && "cursor-not-allowed text-muted",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";
