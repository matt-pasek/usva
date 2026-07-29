import type { ReactNode } from "react";
import { ComponentNav } from "@/components/ComponentNav";
import { DocsAtmosphere } from "@/components/docs/docs-atmosphere";
import { InstallModeProvider } from "@/components/docs/install-mode";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <InstallModeProvider>
      <div className="mx-auto flex w-full max-w-7xl gap-10 px-4 py-8 md:px-8">
        <DocsAtmosphere />
        <aside className="hidden w-56 shrink-0 md:block">
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
    </InstallModeProvider>
  );
}
