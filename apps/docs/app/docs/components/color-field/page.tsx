import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { ColorFieldDemo } from "./color-field-demo";

export const metadata: Metadata = pageMetadata("/docs/components/color-field", {
  title: "Color Field",
  description:
    "Picks a colour and shows you the value. The swatch is the control, and it is for overriding a role token, never for hardcoding one.",
});

const props = [
  {
    name: "value",
    type: "string",
    desc: "controlled hex, #rrggbb.",
  },
  {
    name: "defaultValue",
    type: "string",
    defaultValue: '"#000000"',
    desc: "initial hex when uncontrolled.",
  },
  {
    name: "onValueChange",
    type: "(hex: string) => void",
    desc: (
      <>
        fires only when the text parses as six-digit hex.{" "}
        <b>a malformed draft never escapes the field</b>.
      </>
    ),
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "label for the hex input.",
  },
  {
    name: "swatchLabel",
    type: "string",
    defaultValue: '"Pick a color"',
    desc: "accessible name for the swatch, which is its own focusable control.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "disables both the swatch and the hex input.",
  },
  {
    name: "id",
    type: "string",
    desc: "id for the hex input. generated if omitted.",
  },
];

export default function ColorFieldPage() {
  return (
    <ComponentDoc
      slug="color-field"
      client
      description={
        <>
          a color input: a swatch and a hex field that validates as you type,
          bound to one solid value.
        </>
      }
      composition={{
        ok: [
          "theme editors and settings panels that repaint a role token",
          "wire onValueChange to a css variable, never to a component prop",
        ],
        no: [
          "never to paint one button. paint the token, or add the missing role",
          "not a full picker. six digits and a swatch is the whole surface",
        ],
      }}
      a11y={
        <>
          the swatch is named by{" "}
          <code className="font-mono text-xs">swatchLabel</code> · the hex input
          is labelled and sets{" "}
          <code className="font-mono text-xs">aria-invalid</code> on a malformed
          draft · both carry the focus ring
        </>
      }
    >
      <ColorFieldDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="color-field"
        usage={`import { ColorField } from "@matt-pasek/usva";

<ColorField
  label="Accent"
  value={accent}
  onValueChange={(hex) => {
    setAccent(hex);
    document.documentElement.style.setProperty("--usva-accent", hex);
  }}
/>`}
      />
    </ComponentDoc>
  );
}
