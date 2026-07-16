import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SulaNav, type SulaNavView } from "./sula-nav.js";

const reducedMotion = { current: false };
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}));

vi.mock("../sula-core/field.js", () => ({
  resolveColor: () => [0, 0, 0],
  shineForBackdrop: () => 1,
  createField: () => ({
    resize: vi.fn(),
    setColors: vi.fn(),
    draw: vi.fn(),
    dispose: vi.fn(),
  }),
}));

const views: SulaNavView[] = [
  {
    href: "/",
    label: "Site",
    icon: <svg aria-hidden="true" />,
    items: [
      { href: "#home", label: "Home" },
      { href: "#work", label: "Work" },
      { href: "#notes", label: "Notes" },
    ],
  },
  {
    href: "/writing",
    label: "Writing",
    icon: <svg aria-hidden="true" />,
    items: [{ href: "#latest", label: "Latest" }],
  },
  { href: "/play", label: "Playground", icon: <svg aria-hidden="true" /> },
];

const matchMedia = (reduced: boolean, below = false) =>
  vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduced-motion") ? reduced : below,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));

beforeEach(() => {
  reducedMotion.current = false;
  vi.stubGlobal("matchMedia", matchMedia(false));
});
afterEach(() => {
  vi.unstubAllGlobals();
});

const canvasOf = (container: HTMLElement) => container.querySelector("canvas");

describe("SulaNav", () => {
  it("is a labelled landmark holding the active view's section links", () => {
    render(<SulaNav views={views} activeView="/" ariaLabel="Site" />);
    const nav = screen.getByRole("navigation", { name: "Site" });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Work" })).toBeInTheDocument();
  });

  it("shows inactive views as collapsed pills named by their label", () => {
    render(<SulaNav views={views} activeView="/" />);
    expect(screen.getByRole("link", { name: "Writing" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Playground" }),
    ).toBeInTheDocument();
  });

  it("expands whichever view is active into its section bar", () => {
    render(<SulaNav views={views} activeView="/writing" />);
    expect(screen.getByRole("link", { name: "Latest" })).toBeInTheDocument();
    // The now-inactive first view collapses to its pill.
    expect(screen.getByRole("link", { name: "Site" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Work" }),
    ).not.toBeInTheDocument();
  });

  it("calls onViewChange with the clicked collapsed view's href", async () => {
    const onViewChange = vi.fn();
    render(
      <SulaNav
        views={views}
        activeView="/"
        onViewChange={onViewChange}
        fluid={false}
      />,
    );
    await userEvent.click(screen.getByRole("link", { name: "Writing" }));
    expect(onViewChange).toHaveBeenCalledWith("/writing");
  });

  it("marks the active section tab with aria-current", () => {
    render(<SulaNav views={views} activeView="/" activeItem="#work" />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("calls onNavigate with the clicked section href", async () => {
    const onNavigate = vi.fn();
    render(
      <SulaNav
        views={views}
        activeView="/"
        onNavigate={onNavigate}
        fluid={false}
      />,
    );
    await userEvent.click(screen.getByRole("link", { name: "Notes" }));
    expect(onNavigate).toHaveBeenCalledWith("#notes");
  });

  it("renders satellites as labelled groups holding their own controls", () => {
    render(
      <SulaNav
        views={views}
        activeView="/"
        satellites={[
          {
            id: "search",
            align: "left",
            label: "Search",
            children: <button type="button">search</button>,
          },
          {
            id: "theme",
            align: "right",
            label: "Theme",
            children: <button type="button">kajo</button>,
          },
        ]}
      />,
    );
    expect(screen.getByRole("group", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "search" })).toBeInTheDocument();
  });

  it("melts satellites out of reach with the rest of the sides", () => {
    render(
      <SulaNav
        views={views}
        activeView="/"
        sidesOpen={false}
        satellites={[
          {
            id: "theme",
            label: "Theme",
            children: <button type="button">kajo</button>,
          },
        ]}
      />,
    );
    expect(screen.getByRole("group", { name: "Theme" })).toHaveAttribute(
      "inert",
    );
  });

  it("renders the brand slot named by brandLabel", () => {
    render(
      <SulaNav
        views={views}
        brand={<span>usva.</span>}
        brandLabel="usva home"
      />,
    );
    expect(screen.getByRole("link", { name: "usva home" })).toBeInTheDocument();
    expect(screen.getByText("usva.")).toBeInTheDocument();
  });

  it("renders through a custom link component", () => {
    const Link = ({ href, ...rest }: React.ComponentProps<"a">) => (
      <a data-testid="custom" href={href} {...rest} />
    );
    render(<SulaNav views={views} activeView="/" linkComponent={Link} />);
    // three section tabs + two collapsed view pills
    expect(screen.getAllByTestId("custom")).toHaveLength(5);
  });

  it("mounts a decorative canvas once it is on the client", () => {
    const { container } = render(<SulaNav views={views} />);
    expect(canvasOf(container)?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("mounts no canvas when fluid is off", () => {
    const { container } = render(<SulaNav views={views} fluid={false} />);
    expect(canvasOf(container)).toBeNull();
    expect(screen.getByRole("navigation")).toHaveAttribute("data-fluid", "off");
  });

  it("guards server-shaped desktop markup below the collapse breakpoint", () => {
    render(<SulaNav views={views} collapseBelow="md" fluid={false} />);
    expect(screen.getByRole("navigation")).toHaveClass("max-md:invisible");
  });

  it("hides closed-panel overflow and gives the open mobile menu viewport room", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    const user = userEvent.setup();
    render(<SulaNav views={views} collapseBelow="md" />);

    const trigger = screen.getByRole("button", { name: "Menu" });
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls") ?? "",
    );
    expect(panel).toHaveClass("overflow-hidden");
    expect(panel).toHaveClass("max-h-[min(520px,calc(100dvh-5rem))]");

    await user.click(trigger);
    expect(panel).toHaveClass("overflow-y-auto");
    expect(panel).not.toHaveClass("overflow-hidden");
  });

  it("mounts no canvas when the user asked for reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<SulaNav views={views} />);
    expect(canvasOf(container)).toBeNull();
  });

  it("pulls the melted-in sides out of the tab order", () => {
    const { rerender } = render(
      <SulaNav
        views={views}
        activeView="/"
        fluid={false}
        brand={<span>usva.</span>}
        brandLabel="usva home"
        sidesOpen={false}
      />,
    );
    const brand = screen.getByRole("link", { name: "usva home" });
    expect(brand.closest("[inert]")).not.toBeNull();

    rerender(
      <SulaNav
        views={views}
        activeView="/"
        fluid={false}
        brand={<span>usva.</span>}
        brandLabel="usva home"
        sidesOpen
      />,
    );
    expect(brand.closest("[inert]")).toBeNull();
  });

  // Real motion springs on purpose: the bug this guards against lived in
  // motion's per-subject visual element cache, which a mocked animate never hits.
  it("runs the liquid switch on every view change, not only the first", async () => {
    const { rerender } = render(
      <SulaNav views={views} activeView="/" revealDelay={0} />,
    );
    const pill = (name: string) =>
      screen.getByRole("link", { name }).closest("div") as HTMLDivElement;
    const dipped = (name: string) =>
      Number.parseFloat(pill(name).style.opacity) < 0.55;

    await vi.waitFor(() => expect(pill("Writing").style.opacity).toBe("1"), {
      timeout: 10_000,
    });

    rerender(<SulaNav views={views} activeView="/writing" revealDelay={0} />);
    await vi.waitFor(() => expect(dipped("Site")).toBe(true), {
      timeout: 4_000,
    });
    await vi.waitFor(() => expect(pill("Site").style.opacity).toBe("1"), {
      timeout: 10_000,
    });

    rerender(<SulaNav views={views} activeView="/play" revealDelay={0} />);
    await vi.waitFor(() => expect(dipped("Writing")).toBe(true), {
      timeout: 4_000,
    });
  }, 30_000);

  it("has no axe violations, fluid or not", async () => {
    const fluid = render(
      <SulaNav
        views={views}
        activeView="/"
        activeItem="#work"
        brand={<span>usva.</span>}
        brandLabel="usva home"
      />,
    );
    expect(await axe(fluid.container)).toHaveNoViolations();
    fluid.unmount();

    const plain = render(<SulaNav views={views} fluid={false} />);
    expect(await axe(plain.container)).toHaveNoViolations();
  });
});
