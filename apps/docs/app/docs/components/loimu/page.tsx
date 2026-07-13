import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { LoimuDemo, LoimuScrimDemo } from "./loimu-demo";

export const metadata: Metadata = {
  title: "Loimu",
  description:
    "Loimu: an off-frame light sheet, curl-advected and pointer-reactive. The sisu background, designed to be seen under a three-layer CSS scrim.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered above the sheet, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Flow and fold rate multiplier. Defaults to 1.",
  },
  {
    name: "interactive",
    type: "boolean",
    desc: "When on, a vortex is added to the curl field at the eased cursor and the streamers bend toward it. Defaults to true.",
  },
  {
    name: "opacity",
    type: "number",
    desc: "Overall opacity of the sheet, 0 to 1. Defaults to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "Forces the blend. By default a dark ground emits and a light ground stains, which is the only way this survives a light theme.",
  },
  {
    name: "colors",
    type: "{ body?; deep?; edge? }",
    desc: "The hue along the flow: body reads accent, deep reads accent-2 where the light is oldest, edge reads accent-alt on the leading lines. Omitted stops read their token.",
  },
  {
    name: "params",
    type: "Partial<LoimuParams>",
    desc: "The field: focal, sheetDist, sheetSpan, sigma, fold, foldScale, normal, flow, source, noiseFreq, stretch, curlScale, curlAmt, flowSpeed, omega, threshold, sharpen, falloff, gain, edge, edgeBands, flowLength.",
  },
];

const usage = `import { Loimu } from "@matt-pasek/usva";

<Loimu className="relative min-h-svh">
  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: SCRIM }} />
  <Hero className="relative" />
</Loimu>`;

const scrim = `const SCRIM = [
  "linear-gradient(to bottom, rgba(13,13,17,0) 42%, rgba(13,13,17,0.72) 78%, #0d0d11 100%)",
  "linear-gradient(105deg, rgba(13,13,17,0) 46%, rgba(13,13,17,0.78) 72%, #0d0d11 92%)",
  "radial-gradient(ellipse 62% 58% at 24% 43%, rgba(13,13,17,0) 0%, rgba(13,13,17,0.55) 58%, rgba(13,13,17,0.9) 100%)",
].join(", ");`;

function PropsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4 font-medium">Prop</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs text-ink">{p.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {p.type}
              </td>
              <td className="py-2 text-muted">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LoimuPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Loimu</h1>
        <p className="text-muted">
          Loimu is Finnish for a blaze. Light arrives from something enormous
          and off-frame, high and to the right, already organised into long,
          softly parallel streamers leaning along a shared diagonal. They read
          as one moving sheet, with drifting boundaries where one streamer's
          edge slides over another, and the hue shifts along the direction of
          travel. Then it decays to nothing well before the frame edge.
        </p>
      </div>

      <Card>
        <CardHeader>Demo, with the scrim on</CardHeader>
        <CardBody className="flex flex-col gap-3 bg-bg pt-0!">
          <p className="text-sm text-muted">
            This effect is designed to sit under a three-layer CSS scrim, and it
            is meant to be looked at that way. The scrim keeps a diagonal wedge
            and destroys the rest of the frame, so the shader's job is not to
            fill it: it is to be at its best in the wedge and fall off into void
            everywhere else. Toggle it to see both.
          </p>
          <LoimuScrimDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The scrim</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Three layers: a vertical gradient crushing the bottom, a 105-degree
            diagonal gradient killing the right side, and a radial ellipse
            punching a transparent hole at 24% / 43% where the light survives.
            The hard edge is CSS, not shader. The shader stays soft and
            unbounded and lets the scrim do the cutting, because two edges
            fighting is how this goes ugly.
          </p>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{scrim}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The source is real, not a vignette</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            <code>params.source</code> is a point outside the viewport and
            emission falls off with distance from it, so the light genuinely
            arrives from out there. The streamers are noise in a domain
            stretched along the flow axis and advected by a divergence-free curl
            field, and the hue rides the distance already travelled along the
            streamline. Drop the anisotropy or the advection and this collapses
            into flowing gradients.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The pointer bends the field</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>interactive</code> on, a rotational vortex is added to
            the curl field at the eased cursor and the streamers lean toward it
            from a distance. There is no cursor object and no spotlight.{" "}
            <code>params.omega</code> sets how hard it pulls. Off, the sheet
            just flows.
          </p>
          <LoimuDemo
            interactive={false}
            caption="interactive off: the sheet flows and ignores the pointer"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Quieter, or recoloured</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>opacity</code> and <code>speed</code> pull it back;{" "}
            <code>colors</code> retunes any stop of the flow ramp. There is no
            bloom here and there should not be.
          </p>
          <LoimuDemo
            opacity={0.7}
            speed={0.6}
            colors={{ body: "#419648", deep: "#12303a", edge: "#cfe8a0" }}
            caption="the sisu green, dimmed and slowed"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            frame of a developed sheet. The loop pauses offscreen and on a
            backgrounded tab. With no WebGL2 the canvas never mounts and the
            scrim sits on the plain ground. The canvas is hidden from assistive
            tech.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="loimu" />
          <p className="text-sm text-muted">
            Pulls in <code>ogl</code> and the shared <code>effects-core</code>{" "}
            shell, which the registry adds for you. The scrim is yours to write;
            it is four lines of CSS and it belongs to the page, not to the
            effect.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usage}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <SourceView filePath="packages/usva/src/effects/loimu/loimu.tsx" />
          <SourceView filePath="packages/usva/src/effects/loimu/loimu-field.ts" />
          <SourceView filePath="packages/usva/src/effects/loimu/loimu-uniforms.ts" />
          <SourceView filePath="packages/usva/src/effects/loimu/loimu-shader.ts" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
          <PropsTable />
        </CardBody>
      </Card>
    </main>
  );
}
