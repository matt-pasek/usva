import type { ReactNode } from "react";
import { ComponentNav } from "@/components/ComponentNav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-8 md:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        {/* Clears the floating nav, which the sidebar would otherwise stick up under. */}
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain pr-2 pb-8">
          <ComponentNav />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 border-b border-border pb-4 md:hidden">
          <div className="min-w-0 overflow-hidden">
            <ComponentNav orientation="horizontal" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
