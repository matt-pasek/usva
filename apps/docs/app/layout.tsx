import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Fira_Code, Fira_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { RailoSplash } from "@/components/railo-splash";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { rootGraph } from "@/lib/schema";
import { pageMetadata, SITE_DESCRIPTION, SITE_ORIGIN } from "@/lib/site";
import { splashScript } from "@/lib/splash-script";
import { themeScript } from "@/lib/theme-script";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-fira-sans",
  display: "swap",
});

/** Variable, so the whole 300-700 range costs one file and no weight list. */
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

/**
 * Metadata is Sentence case, everywhere, and that is not a lapse in the voice.
 * On-page copy is lowercase because usva is speaking in its own room. Metadata
 * renders in someone else's chrome, a tab, a search result, a link unfurl, with
 * nothing around it to show that the lowercase is a system rather than a typo.
 * The brand keeps its own casing wherever it appears: `usva.`, never `Usva.`.
 */
export const metadata: Metadata = pageMetadata("/", {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "usva. · Beautiful, usable React components",
    template: "%s · usva.",
  },
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", siteName: "usva." },
  twitter: { card: "summary_large_image" },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* The theme lands on <html> from a blocking script, so it is already right
     * on the first paint and the server markup cannot match it. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${firaSans.variable} ${firaCode.variable}`}
    >
      <head>
        <JsonLd data={rootGraph()} />
      </head>
      <body>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: the theme must be set before the first paint, which rules out anything React runs
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: the cover has to know whether to show itself before it is painted, for the same reason
          dangerouslySetInnerHTML={{ __html: splashScript }}
        />
        <RailoSplash />
        <ThemeProvider>
          <SiteNav />
          {/* The nav floats over the page, so the content starts below it. */}
          <div className="pt-20 sm:pt-24">{children}</div>
          <SiteFooter />
        </ThemeProvider>
        <div aria-hidden id="grain" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
