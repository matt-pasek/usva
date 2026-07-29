import type { ReactNode } from "react";
import { DesignLanguageNav } from "@/components/design-language/dl-nav";

export default function DesignLanguageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-10 px-4 py-8 md:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain pr-2 pb-8">
          <DesignLanguageNav />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 border-b border-border pb-4 md:hidden">
          <div className="min-w-0 overflow-hidden">
            <DesignLanguageNav orientation="horizontal" />
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
