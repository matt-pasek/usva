import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { MultipleDemo, SingleDemo } from "./toggle-chip-demo";

export const metadata: Metadata = {
  title: "Toggle Chip",
  description:
    "A row of pressable chips for picking what a view shows. Bounded multi-select, or one-of-many.",
};

const groupProps = [
  {
    name: "type",
    type: '"multiple" | "single"',
    desc: "Defaults to multiple. In single mode the last chip cannot be deselected.",
  },
  {
    name: "value",
    type: "string | string[]",
    desc: "The selected ids. Controlled; there is no uncontrolled mode.",
  },
  {
    name: "onValueChange",
    type: "(value: string[]) => void",
    desc: "Always an array, in both modes.",
  },
  {
    name: "min",
    type: "number",
    desc: "multiple only. Selected chips go disabled once the count reaches it.",
  },
  {
    name: "max",
    type: "number",
    desc: "multiple only. Unselected chips go disabled once the count reaches it.",
  },
  {
    name: "label",
    type: "React.ReactNode",
    desc: "Mono eyebrow before the chips. Names the group when it is a string.",
  },
  {
    name: "ariaLabel",
    type: "string",
    desc: "Names the group. Required when there is no string label.",
  },
  { name: "disabled", type: "boolean", desc: "Disables every chip." },
];

const chipProps = [
  {
    name: "value",
    type: "string",
    desc: "The chip's id. Must be unique inside the group.",
  },
  {
    name: "disabled",
    type: "boolean",
    desc: "Disables this chip on top of whatever the group decides.",
  },
];

const usage = `import { ToggleChip, ToggleChipGroup } from "@matt-pasek/usva";

const [stats, setStats] = useState(["grade-avg", "active-courses"]);

<ToggleChipGroup
  value={stats}
  onValueChange={setStats}
  min={2}
  max={4}
  ariaLabel="Visible stats"
>
  <ToggleChip value="grade-avg">Grade avg.</ToggleChip>
  <ToggleChip value="active-courses">Active courses</ToggleChip>
</ToggleChipGroup>`;

function PropsTable({
  rows,
}: {
  rows: { name: string; type: string; desc: string }[];
}) {
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
          {rows.map((p) => (
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

export default function ToggleChipPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Toggle Chip</h1>
        <p className="text-muted">
          Pressable chips for choosing what a view shows. Use them where a
          checkbox list would be too heavy and a dropdown would hide the
          choices.
        </p>
      </div>

      <Card>
        <CardHeader>Bounded multi-select</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <MultipleDemo />
          <p className="text-sm text-muted">
            With <code>min={"{2}"}</code> and <code>max={"{4}"}</code>, the
            group disables the chips that would take the selection out of range
            rather than letting the click fail silently.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>One of many</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <SingleDemo />
          <p className="text-sm text-muted">
            <code>type="single"</code> keeps exactly one chip pressed. Clicking
            the pressed chip does nothing, so a view can never end up with no
            panel selected.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Pressed, not checked</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            Each chip is a button carrying <code>aria-pressed</code>, and the
            group is a <code>fieldset</code>, so <code>disabled</code> reaches
            every chip without a single prop being threaded down. Single mode is
            not a radio group: it has no roving focus, so every chip stays
            reachable with Tab. That matches how these read in practice, as a
            row of switches rather than a form field.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="toggle-chip" />
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
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/toggle-chip/toggle-chip.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>ToggleChipGroup props</CardHeader>
        <CardBody>
          <PropsTable rows={groupProps} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>ToggleChip props</CardHeader>
        <CardBody>
          <PropsTable rows={chipProps} />
        </CardBody>
      </Card>
    </main>
  );
}
