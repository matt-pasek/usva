import {
  Card,
  CardBody,
  CardHeader,
  InlineError,
  LogLine,
  LogList,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Log Line",
  description:
    "A mono log readout with a colored severity rail, source, repeat count and an optional expandable detail block.",
};

const props = [
  {
    name: "level",
    type: '"error" | "warn" | "info" | "debug" | "success"',
    desc: "Log levels, not semantic roles. They resolve to danger, warning, info, muted and success.",
  },
  {
    name: "source",
    type: "React.ReactNode",
    desc: "Endpoint, module or subsystem the line came from.",
  },
  {
    name: "count",
    type: "number",
    desc: "Repeat collapsing. Values at or below 1 render no chip.",
  },
  {
    name: "details",
    type: "React.ReactNode",
    desc: "Stack trace or payload. Its presence turns the row into a disclosure.",
  },
  {
    name: "timestamp",
    type: "React.ReactNode",
    desc: "Optional leading column, tabular figures.",
  },
];

const usage = `import { LogLine, LogList, InlineError } from "@matt-pasek/usva";

<LogList>
  <LogLine level="error" source="/api/courses" count={3}>
    Failed to fetch: 502 Bad Gateway
  </LogLine>
  <LogLine level="warn" source="parser">
    Skipped 3 malformed rows
  </LogLine>
</LogList>

<InlineError source="/api/courses" error={err} />`;

export default function LogLinePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Log Line</h1>
        <p className="text-muted">
          Severity lives in a glowing rail in the gutter, so a wall of lines
          scans by color before you read a word. <code>LogList</code> is an
          announced polite region; <code>InlineError</code> is the single-line
          preset for sitting beside a panel that failed to load.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <LogList>
            <LogLine level="error" source="/api/courses" count={3}>
              Failed to fetch: 502 Bad Gateway
            </LogLine>
            <LogLine level="warn" source="parser">
              Skipped 3 malformed rows
            </LogLine>
            <LogLine level="info" source="sync">
              Reconciled 128 records
            </LogLine>
            <LogLine level="success" source="writer">
              Wrote 128 records
            </LogLine>
            <LogLine level="debug" source="cache">
              hit ratio 0.94
            </LogLine>
          </LogList>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Expandable detail</CardHeader>
        <CardBody>
          <LogList>
            <LogLine
              level="error"
              source="/api/courses"
              timestamp="14:22:07.412"
              details={
                "at fetchCourses (api/courses.ts:41)\nat loadDashboard (views/dashboard.tsx:88)"
              }
            >
              Failed to fetch: 502 Bad Gateway
            </LogLine>
            <LogLine level="info" source="boot" timestamp="14:22:06.771">
              Cold start
            </LogLine>
          </LogList>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Inline error</CardHeader>
        <CardBody>
          <InlineError
            source="/api/courses"
            error={new Error("502 Bad Gateway")}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="log-line" />
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
          <SourceView filePath="packages/usva/src/primitives/log-line/log-line.tsx" />
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
