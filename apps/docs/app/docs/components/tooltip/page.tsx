import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { TooltipDemo } from "./tooltip-demo";

export const metadata: Metadata = {
  title: "Tooltip",
  description:
    "An accessible tooltip built on Base UI, with a provider, portal-positioned content, and an animated enter/exit.",
};

const props = [
  {
    name: "delay",
    type: "number",
    desc: "Hover delay in ms before the tooltip opens (set on TooltipProvider).",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    desc: "Whether the tooltip is open by default (uncontrolled).",
  },
  {
    name: "open",
    type: "boolean",
    desc: "Controlled open state.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    desc: "Fires when the open state changes.",
  },
  {
    name: "sideOffset",
    type: "number",
    desc: "Distance in px between trigger and content (on TooltipContent). Defaults to 6.",
  },
];

const usageSnippet = `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@matt-pasek/usva";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<button>Hover me</button>} />
    <TooltipContent>Helpful hint</TooltipContent>
  </Tooltip>
</TooltipProvider>`;

export default function TooltipPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Tooltip</h1>
        <p className="text-muted">
          Built on Base UI <code>Tooltip</code>, with a portal-positioned popup,
          a shared <code>TooltipProvider</code>, and an animated enter/exit.
          Compose <code>TooltipTrigger</code> onto any element via its{" "}
          <code>render</code> prop.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <TooltipDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="tooltip" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/tooltip/tooltip.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
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
                    <td className="py-2 pr-4 font-mono text-xs text-ink">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {p.type}
                    </td>
                    <td className="py-2 text-muted">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
