import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineError, LogLine, LogList } from "./log-line.js";

const meta: Meta<typeof LogLine> = {
  title: "Primitives/LogLine",
  component: LogLine,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: { type: "select" },
      options: ["error", "warn", "info", "debug", "success"],
    },
  },
  args: {
    level: "info",
    source: "sync",
    children: "Reconciled 128 records",
  },
};

export default meta;
type Story = StoryObj<typeof LogLine>;

export const Stack: Story = {
  render: () => (
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
      <LogLine level="debug" source="cache">
        hit ratio 0.94
      </LogLine>
    </LogList>
  ),
};

export const WithDetails: Story = {
  render: () => (
    <LogList>
      <LogLine
        level="error"
        source="/api/courses"
        details={
          "at fetchCourses (api/courses.ts:41)\nat load (dashboard.tsx:88)"
        }
      >
        Failed to fetch: 502 Bad Gateway
      </LogLine>
      <LogLine level="success" source="sync">
        Wrote 128 records
      </LogLine>
    </LogList>
  ),
};

export const Timestamped: Story = {
  render: () => (
    <LogList>
      <LogLine level="info" source="boot" timestamp="14:22:06.771">
        Cold start
      </LogLine>
      <LogLine level="warn" source="parser" timestamp="14:22:07.104">
        Skipped 3 malformed rows
      </LogLine>
    </LogList>
  ),
};

export const Levels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["error", "warn", "info", "debug", "success"] as const).map((level) => (
        <LogList key={level} className="w-64">
          <LogLine level={level} source="sync">
            {level}
          </LogLine>
        </LogList>
      ))}
    </div>
  ),
};

export const Inline: StoryObj<typeof InlineError> = {
  render: () => (
    <InlineError source="/api/courses" error={new Error("502 Bad Gateway")} />
  ),
};
