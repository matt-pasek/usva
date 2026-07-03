"use client";
import { cn } from "@matt-pasek/usva/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { componentNav } from "./component-nav";

type Props = { orientation?: "vertical" | "horizontal" };

export function ComponentNav({ orientation = "vertical" }: Props) {
  const pathname = usePathname();
  const horizontal = orientation === "horizontal";

  return (
    <nav
      aria-label="Components"
      className={cn(
        horizontal ? "flex gap-2 overflow-x-auto pb-1" : "flex flex-col gap-6",
      )}
    >
      {componentNav.map((group) => (
        <div
          key={group.label}
          className={cn(
            horizontal ? "flex items-center gap-2" : "flex flex-col gap-2",
          )}
        >
          {!horizontal && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint">
                {group.label}
              </span>
              <span className="hairline-accent h-px flex-1" />
            </div>
          )}
          <ul
            className={cn(horizontal ? "flex gap-2" : "flex flex-col gap-0.5")}
          >
            {group.items.map((item) => {
              const href = `/docs/components/${item.slug}`;
              const active = pathname === href;
              return (
                <li
                  key={item.slug}
                  className={horizontal ? "shrink-0" : undefined}
                >
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 text-sm transition-[color,background-color,box-shadow] duration-150 ease-soft",
                      "whitespace-nowrap outline-none focus-visible:ring-focus",
                      active
                        ? "bg-surface-2 text-ink glow-accent"
                        : "text-muted hover:bg-surface hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
