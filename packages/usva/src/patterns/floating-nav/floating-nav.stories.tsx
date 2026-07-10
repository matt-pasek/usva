import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../primitives/button/index.js";
import { FloatingNav, type FloatingNavView } from "./floating-nav.js";

const meta: Meta<typeof FloatingNav> = {
  title: "Patterns/FloatingNav",
  component: FloatingNav,
};
export default meta;

type Story = StoryObj<typeof FloatingNav>;

const Spark = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <title>Playground</title>
    <path
      d="M12 3l2.2 6.1L20 12l-5.8 2.9L12 21l-2.2-6.1L4 12l5.8-2.9z"
      fill="currentColor"
    />
  </svg>
);

const Dot = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <title>View</title>
    <circle cx="12" cy="12" r="6" fill="currentColor" />
  </svg>
);

const VIEWS: FloatingNavView[] = [
  {
    href: "/",
    label: "Site",
    icon: <Dot />,
    items: [
      { href: "#home", label: "Home" },
      { href: "#work", label: "Work" },
      { href: "#writing", label: "Writing" },
      { href: "#about", label: "About" },
    ],
  },
  {
    href: "/writing",
    label: "Writing",
    icon: <Dot />,
    items: [
      { href: "#latest", label: "Latest" },
      { href: "#archive", label: "Archive" },
    ],
  },
  { href: "/play", label: "Playground", icon: <Spark />, items: [] },
];

function Demo({
  fluid = true,
  views = VIEWS,
  offset = 0,
}: {
  fluid?: boolean;
  views?: FloatingNavView[];
  offset?: number;
}) {
  const [view, setView] = useState(views[0]?.href);
  const [item, setItem] = useState(views[0]?.items?.[0]?.href);
  return (
    <div className="flex min-h-72 justify-center bg-bg pt-4">
      <FloatingNav
        fluid={fluid}
        views={views}
        activeView={view}
        onViewChange={(href) => {
          setView(href);
          setItem(views.find((v) => v.href === href)?.items?.[0]?.href);
        }}
        activeItem={item}
        onNavigate={setItem}
        brand={<span className="tracking-tight">usva.</span>}
        brandLabel="usva home"
        offset={offset}
      />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const NoFluid: Story = { render: () => <Demo fluid={false} /> };

export const TwoViews: Story = {
  render: () => <Demo views={VIEWS.slice(0, 2)} />,
};

export const Offset: Story = { render: () => <Demo offset={24} /> };

export const Reveal: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    return (
      <div className="flex flex-col items-center gap-6">
        <Demo key={key} />
        <Button onClick={() => setKey((n) => n + 1)}>Replay</Button>
      </div>
    );
  },
};
