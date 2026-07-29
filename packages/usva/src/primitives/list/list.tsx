"use client";
import * as React from "react";
import { cn } from "../../cn.js";

const ListContext = React.createContext<React.ReactNode>(null);

export interface ListProps extends React.HTMLAttributes<HTMLElement> {
  as?: "ul" | "ol";
  /** Decorative marker rendered on every item. An item may override it. */
  marker?: React.ReactNode;
  /** Rule between items, stopping at the last one. */
  divided?: boolean;
}

export const List = React.forwardRef<HTMLElement, ListProps>(
  (
    { className, as: Comp = "ul", marker, divided, children, ...props },
    ref,
  ) => (
    <ListContext.Provider value={marker ?? null}>
      <Comp
        ref={ref as React.Ref<HTMLUListElement & HTMLOListElement>}
        className={cn(
          "flex list-none flex-col",
          divided &&
            "[&>li]:border-b [&>li]:border-border [&>li:last-child]:border-0",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    </ListContext.Provider>
  ),
);
List.displayName = "List";

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Overrides the list's shared marker for this item alone. */
  marker?: React.ReactNode;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, marker, children, ...props }, ref) => {
    const shared = React.useContext(ListContext);
    const shown = marker ?? shared;
    return (
      <li
        ref={ref}
        className={cn(
          "flex items-start gap-3 px-3 py-4 text-muted",
          "transition-tint duration-fast ease-soft hover:text-ink motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {shown != null && (
          <span
            data-list-marker=""
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-accent-alt [&_svg]:size-4"
          >
            {shown}
          </span>
        )}
        <span className="min-w-0 flex-1">{children}</span>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
