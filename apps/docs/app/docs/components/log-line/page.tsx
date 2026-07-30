import {
  InlineError,
  LogLine,
  LogList,
} from "@usva-ui/react/primitives/log-line";
import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/docs/components/log-line", {
  title: "Log Line",
  description:
    "One machine event: a severity rail, a level, a source, a repeat count, and the detail if you want it.",
});

const props = [
  {
    name: "level",
    type: '"error" | "warn" | "info" | "debug" | "success"',
    desc: "log levels, not semantic roles. they resolve to danger, warning, info, muted and success.",
  },
  {
    name: "source",
    type: "ReactNode",
    desc: "endpoint, module or subsystem the line came from.",
  },
  {
    name: "count",
    type: "number",
    desc: "repeat collapsing. values at or below 1 render no chip.",
  },
  {
    name: "details",
    type: "ReactNode",
    desc: (
      <>
        stack trace or payload. its presence swaps the row to a{" "}
        <code>&lt;details&gt;</code> disclosure, so <b>treat it as static</b>{" "}
        per entry.
      </>
    ),
  },
  {
    name: "timestamp",
    type: "ReactNode",
    desc: "optional leading column, tabular figures.",
  },
];

export default function LogLinePage() {
  return (
    <ComponentDoc
      slug="log-line"
      description={
        <>
          one line of a log: a message tagged with a severity color and its
          source. LogList stacks them, InlineError is the single-line preset for
          a panel that failed to load.
        </>
      }
      composition={{
        ok: [
          "a LogList inside a Card or dashboard panel for recent activity",
          "InlineError in place of the content a failed fetch never delivered",
        ],
        no: [
          "bare LogLines outside a LogList lose the surface and dividers",
          "not a terminal. commands to run go in Terminal or CodeSnippet",
        ],
      }}
      a11y={
        <>
          LogList is <code className="font-mono text-xs">role="log"</code> with{" "}
          <code className="font-mono text-xs">aria-live="polite"</code> ·
          InlineError is an alert · the count chip reads as "repeated n times"
        </>
      }
    >
      <DemoPanel label="levels">
        <div className="mx-auto max-w-xl">
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
        </div>
      </DemoPanel>

      <DemoPanel label="expandable detail">
        <div className="mx-auto max-w-xl">
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
        </div>
      </DemoPanel>

      <DemoPanel label="inline error">
        <div className="mx-auto max-w-xl">
          <InlineError
            source="/api/courses"
            error={new Error("502 Bad Gateway")}
          />
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="log-line"
        usage={`import { InlineError, LogLine, LogList } from "@usva-ui/react/primitives/log-line";

<LogList>
  <LogLine level="error" source="/api/courses" count={3}>
    Failed to fetch: 502 Bad Gateway
  </LogLine>
</LogList>

<InlineError source="/api/courses" error={err} />`}
      />
    </ComponentDoc>
  );
}
