import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_ORIGIN } from "@/lib/site";
import { themeScript } from "@/lib/theme-script";

/**
 * Metadata is Sentence case, everywhere, and that is not a lapse in the voice.
 * On-page copy is lowercase because usva is speaking in its own room. Metadata
 * renders in someone else's chrome, a tab, a search result, a link unfurl, with
 * nothing around it to show that the lowercase is a system rather than a typo.
 * The brand keeps its own casing wherever it appears: `usva.`, never `Usva.`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "usva. · Beautiful, usable React components",
    template: "%s · usva.",
  },
  description:
    "An open-source React design system: dual-distributed as an npm package and a shadcn-compatible registry.",
  openGraph: { type: "website", url: SITE_ORIGIN, siteName: "usva." },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "usva.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* The theme lands on <html> from a blocking script, so it is already right
     * on the first paint and the server markup cannot match it. */
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: the theme must be set before the first paint, which rules out anything React runs
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>
          <SiteNav />
          {/* The nav floats over the page, so the content starts below it. */}
          <div className="pt-20 sm:pt-24">{children}</div>
          <SiteFooter />
        </ThemeProvider>
        <div aria-hidden id="grain" />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data must be injected as a raw script body
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
