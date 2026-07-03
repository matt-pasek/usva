import * as React from "react";
import { cn } from "../../cn.js";

type Div = React.HTMLAttributes<HTMLDivElement>;
const make = (base: string, name: string) =>
  Object.assign(
    React.forwardRef<HTMLDivElement, Div>(({ className, ...p }, ref) => (
      <div ref={ref} className={cn(base, className)} {...p} />
    )),
    { displayName: name },
  );

export const Card = make(
  "rounded-lg border border-border bg-surface text-ink shadow-sm",
  "Card",
);
export const CardHeader = make(
  "flex flex-col gap-1 p-5 border-b border-border",
  "CardHeader",
);
export const CardBody = make("p-5", "CardBody");
export const CardFooter = make(
  "flex items-center gap-2 p-5 border-t border-border",
  "CardFooter",
);
