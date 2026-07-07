import * as React from "react";
import { cn } from "../../cn.js";
import { Card } from "../../primitives/card/card.js";
import { List, ListItem } from "../../primitives/list/list.js";

export interface ChecklistCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  items: React.ReactNode[];
  /** Defaults to a tick. Decorative either way. */
  marker?: React.ReactNode;
}

/**
 * A card of reassurances: short claims, each ticked. sisu renders these as bare divs
 * with a bottom border, which reads to a screen reader as loose prose rather than a
 * set of three related items.
 */
export const ChecklistCard = React.forwardRef<
  HTMLDivElement,
  ChecklistCardProps
>(({ className, title, items, marker, ...props }, ref) => (
  <Card ref={ref} className={cn("p-4", className)} {...props}>
    {title != null && (
      <h3 className="px-3 pt-1 pb-2 text-base font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h3>
    )}
    <List marker={marker ?? <TickIcon />} divided>
      {items.map((item, index) => (
        <ListItem key={typeof item === "string" ? item : index}>
          {item}
        </ListItem>
      ))}
    </List>
  </Card>
));
ChecklistCard.displayName = "ChecklistCard";

function TickIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
