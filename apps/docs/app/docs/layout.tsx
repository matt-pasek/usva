import Link from "next/link";
import type { ReactNode } from "react";
import { ComponentNav } from "@/components/ComponentNav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-8 md:px-8">
      <aside className="hidden w-52 shrink-0 md:block">
        <div className="sticky top-8 flex flex-col gap-6">
          <Link
            href="/"
            className="font-semibold tracking-tight text-ink outline-none focus-visible:ring-focus"
          >
            usva<span className="text-accent">.</span>
          </Link>
          <ComponentNav />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 border-b border-border pb-4 md:hidden">
          <ComponentNav orientation="horizontal" />
        </div>
        {children}
      </div>
    </div>
  );
}
