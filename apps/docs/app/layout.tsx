import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://usva.dev"),
  title: {
    default: "usva. — beautiful, usable React components",
    template: "%s · usva.",
  },
  description:
    "An open-source React design system: dual-distributed as an npm package and a shadcn-compatible registry.",
  openGraph: { type: "website", url: "https://usva.dev", siteName: "usva." },
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
    <html lang="en" data-theme="kajo">
      <body>
        {children}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data must be injected as a raw script body
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
