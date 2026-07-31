import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import type * as React from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SulaNav, type SulaNavView } from "./sula-nav.js";

const reducedMotion = { current: false };
const fieldDraw = vi.hoisted(() => vi.fn());
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}));

const fieldSetColors = vi.hoisted(() => vi.fn());
const createFieldSpy = vi.hoisted(() => vi.fn());

vi.mock("../sula-core/field.js", () => ({
  resolveColor: () => [0, 0, 0],
  shineForBackdrop: () => 1,
  createField: (options: unknown) => {
    createFieldSpy(options);
    return {
      resize: vi.fn(),
      setColors: fieldSetColors,
      draw: fieldDraw,
      dispose: vi.fn(),
    };
  },
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
  fieldDraw.mockClear();
  fieldSetColors.mockClear();
  createFieldSpy.mockClear();
  vi.stubGlobal("matchMedia", matchMedia(false));
});
afterEach(() => {
  vi.unstubAllGlobals();
});

const canvasOf = (container: HTMLElement) => container.querySelector("canvas");

describe("SulaNav", () => {
  it("retunes live without rebuilding the gl context", () => {
    const { rerender } = render(
      <SulaNav views={views} shine={0.2} mergeRadius={10} revealDelay={100} />,
    );
    expect(createFieldSpy).toHaveBeenCalledTimes(1);

    for (const shine of [0.3, 0.4, 0.5, 0.6, 0.7]) {
      rerender(
        <SulaNav
          views={views}
          shine={shine}
          mergeRadius={shine * 20}
          revealDelay={shine * 200}
        />,
      );
    }

    expect(createFieldSpy).toHaveBeenCalledTimes(1);
    expect(fieldSetColors).toHaveBeenCalled();
  });

  it("recovers when the browser hands the context back", async () => {
    let lose = () => {};
    createFieldSpy.mockImplementationOnce((options: unknown) => {
      lose = (options as { onContextLost: () => void }).onContextLost;
    });

    const { container } = render(<SulaNav views={views} />);
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(createFieldSpy).toHaveBeenCalledTimes(1);

    await act(async () => lose());

    // The canvas has to stay in the document, or it is never offered a
    // replacement context and the static fallback becomes permanent.
    expect(canvasOf(container)).not.toBeNull();

    await act(async () => {
      canvas?.dispatchEvent(new Event("webglcontextrestored"));
    });

    expect(createFieldSpy).toHaveBeenCalledTimes(2);
  });

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

  it("starts with the fluid shell so plain pills cannot flash before hydration", () => {
    const html = renderToString(<SulaNav views={views} />);
    expect(html).toContain('data-fluid="on"');
    expect(html).toContain("<canvas");
    expect(html).not.toContain("border-border");
  });

  it("keeps field softness fixed while the reveal moves", async () => {
    render(<SulaNav views={views} mergeRadius={13} revealDelay={0} />);

    await vi.waitFor(() => expect(fieldDraw).toHaveBeenCalled());
    await new Promise((resolve) => setTimeout(resolve, 100));

    const softness = fieldDraw.mock.calls.map(([frame]) => frame.k);
    expect(new Set(softness)).toEqual(new Set([13]));
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

  it("resizes the panel without an overshooting timing curve", () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

    const trigger = screen.getByRole("button", { name: "Menu" });
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls") ?? "",
    );
    expect(panel).toHaveClass("ease-soft");
    expect(panel).not.toHaveClass("ease-spring");
  });

  it("does not create a transient scroll layer while the panel changes height", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    let bodyHeight = 300;
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(0, 0, 300, 466));
    const offsetHeight = vi
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockImplementation(() => bodyHeight);
    const readComputedStyle = window.getComputedStyle;
    const computedStyle = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation((element) => {
        const styles = readComputedStyle(element);
        return new Proxy(styles, {
          get(target, key) {
            if (key === "maxHeight") return "520px";
            if (key === "paddingTop" || key === "paddingBottom") return "8px";
            const value = Reflect.get(target, key, target);
            return typeof value === "function" ? value.bind(target) : value;
          },
        });
      });

    try {
      const user = userEvent.setup();
      render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

      const trigger = screen.getByRole("button", { name: "Menu" });
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls") ?? "",
      );
      await user.click(trigger);
      bodyHeight = 600;
      await user.click(screen.getByRole("button", { name: "Writing" }));

      expect(panel).toHaveClass("overflow-clip");
      expect(panel).not.toHaveClass("overflow-y-auto");

      fireEvent.transitionEnd(panel as HTMLElement, {
        propertyName: "clip-path",
      });
      expect(panel).toHaveClass("overflow-y-auto");
    } finally {
      rect.mockRestore();
      offsetHeight.mockRestore();
      computedStyle.mockRestore();
    }
  });

  it("does not create a scroll layer after resizing when the contents fit", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(0, 0, 300, 466));
    const offsetHeight = vi
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockReturnValue(300);
    const readComputedStyle = window.getComputedStyle;
    const computedStyle = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation((element) => {
        const styles = readComputedStyle(element);
        return new Proxy(styles, {
          get(target, key) {
            if (key === "maxHeight") return "520px";
            if (key === "paddingTop" || key === "paddingBottom") return "8px";
            const value = Reflect.get(target, key, target);
            return typeof value === "function" ? value.bind(target) : value;
          },
        });
      });

    try {
      const user = userEvent.setup();
      render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

      const trigger = screen.getByRole("button", { name: "Menu" });
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls") ?? "",
      );
      await user.click(trigger);
      await user.click(screen.getByRole("button", { name: "Writing" }));
      fireEvent.transitionEnd(panel as HTMLElement, {
        propertyName: "clip-path",
      });

      expect(panel).toHaveClass("overflow-clip");
      expect(panel).not.toHaveClass("overflow-y-auto");
    } finally {
      rect.mockRestore();
      offsetHeight.mockRestore();
      computedStyle.mockRestore();
    }
  });

  it("keeps scrolling when both view bodies are already clamped to max height", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(0, 0, 300, 520));
    const offsetHeight = vi
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockReturnValue(600);
    const readComputedStyle = window.getComputedStyle;
    const computedStyle = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation((element) => {
        const styles = readComputedStyle(element);
        return new Proxy(styles, {
          get(target, key) {
            if (key === "maxHeight") return "520px";
            if (key === "paddingTop" || key === "paddingBottom") return "8px";
            const value = Reflect.get(target, key, target);
            return typeof value === "function" ? value.bind(target) : value;
          },
        });
      });

    try {
      const user = userEvent.setup();
      render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

      const trigger = screen.getByRole("button", { name: "Menu" });
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls") ?? "",
      );
      await user.click(trigger);
      await user.click(screen.getByRole("button", { name: "Writing" }));

      expect(panel).toHaveClass("overflow-y-auto");
      expect(panel).not.toHaveClass("overflow-clip");
    } finally {
      rect.mockRestore();
      offsetHeight.mockRestore();
      computedStyle.mockRestore();
    }
  });

  it("folds every view into the menu, leaving no pill stranded in the bar", () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

    expect(screen.queryByRole("link", { name: "Writing" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Playground" })).toBeNull();
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });

  it("lists every view in the collapsed panel", () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

    for (const view of views) {
      expect(
        screen.getByRole("button", { name: view.label }),
      ).toBeInTheDocument();
    }
  });

  it("swaps the panel's item list without navigating away from the view", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    const onViewChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SulaNav
        views={views}
        collapseBelow="md"
        fluid={false}
        onViewChange={onViewChange}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Writing" }));

    expect(screen.getByRole("link", { name: "Latest" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Home" })).toBeNull();
    expect(onViewChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("names a view once, in its switcher row and not again in its items", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    const user = userEvent.setup();
    render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));

    expect(screen.getAllByText("Site")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: "Site" })).toBeNull();
  });

  it("shows a single view's items with no switcher to choose from", () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    const only = views.slice(0, 1);
    render(<SulaNav views={only} collapseBelow="md" fluid={false} />);

    expect(screen.queryByRole("button", { name: "Site" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Site" })).toBeNull();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("reopens the collapsed panel on the view the reader is actually in", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    const user = userEvent.setup();
    render(<SulaNav views={views} collapseBelow="md" fluid={false} />);

    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Writing" }));
    expect(screen.getByRole("link", { name: "Latest" })).toBeInTheDocument();

    await user.click(trigger);
    await user.click(trigger);

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Latest" })).toBeNull();
  });

  it("has no a11y violations with the collapsed panel open on many views", async () => {
    vi.stubGlobal("matchMedia", matchMedia(false, true));
    const user = userEvent.setup();
    const { container } = render(
      <SulaNav views={views} collapseBelow="md" fluid={false} />,
    );

    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(await axe(container)).toHaveNoViolations();
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
