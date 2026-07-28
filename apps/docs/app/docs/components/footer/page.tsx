import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { FooterDemo } from "./footer-demo";

export const metadata: Metadata = pageMetadata("/docs/components/footer", {
  title: "Footer",
  description:
    "The bottom of the site: a brand slot, titled link columns when there is a lot, one flat row when there is not.",
});

const props = [
  {
    name: "variant",
    type: '"full" | "compact"',
    defaultValue: '"full"',
    desc: "full keeps the titled columns. compact flattens them into one untitled row.",
  },
  {
    name: "columns",
    type: "FooterColumn[]",
    defaultValue: "[]",
    desc: (
      <>
        each is <code>{"{ title, tone?, links }"}</code>. the title is the
        column's accessible name, so keep it a string.
      </>
    ),
  },
  {
    name: "brand",
    type: "ReactNode",
    desc: "the wordmark slot.",
  },
  {
    name: "tagline",
    type: "ReactNode",
    desc: "the line under the brand.",
  },
  {
    name: "copyright",
    type: "ReactNode",
    desc: "left side of the bottom bar.",
  },
  {
    name: "note",
    type: "ReactNode",
    desc: "right side of the bottom bar. the bar is omitted when both are absent.",
  },
  {
    name: "glow",
    type: "boolean",
    defaultValue: "false",
    desc: "two decorative radial washes. opt-in because they assume a dark page.",
  },
];

export default function FooterPage() {
  return (
    <ComponentDoc
      slug="footer"
      description={
        <>
          brand, links and a bottom bar, in two layouts: titled columns or a
          flat row. external links open in a new tab; mailto, tel and in-page
          anchors stay put.
        </>
      }
      composition={{
        ok: [
          "the last block on a page, once, below everything",
          "columns hold links. an icon may lead a link",
        ],
        no: [
          "kajo's negative pull-up margin is page layout, it stays in className",
          "never holds forms, feeds or anything that scrolls",
        ],
      }}
      a11y={
        <>
          a <code className="font-mono text-xs">contentinfo</code> landmark ·
          each column is a nav named by its title · offsite links carry an sr
          "opens in a new tab" hint
        </>
      }
    >
      <FooterDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="footer"
        usage={`import { Footer } from "usva/patterns/footer";

<Footer
  brand={<Wordmark />}
  columns={[{ title: "Index", links: [{ label: "About", href: "#about" }] }]}
  copyright="© 2026 Mateusz Pasek"
/>`}
      />
    </ComponentDoc>
  );
}
