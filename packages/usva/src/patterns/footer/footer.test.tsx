import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Footer } from "./footer.js";

const columns = [
  {
    title: "Index",
    links: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
    ],
  },
  {
    title: "Elsewhere",
    tone: "accent-alt" as const,
    links: [
      { label: "GitHub", href: "https://github.com/matt-pasek" },
      { label: "Email", href: "mailto:contact@matt-pasek.dev" },
    ],
  },
];

describe("Footer", () => {
  it("renders a contentinfo landmark", () => {
    render(<Footer columns={columns} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the brand and tagline slots", () => {
    render(
      <Footer
        brand={<span data-testid="brand">usva.</span>}
        tagline="Designer by eye, dev by hand."
        columns={columns}
      />,
    );
    expect(screen.getByTestId("brand")).toBeInTheDocument();
    expect(
      screen.getByText("Designer by eye, dev by hand."),
    ).toBeInTheDocument();
  });

  it("full renders a titled column per group", () => {
    render(<Footer columns={columns} />);
    expect(screen.getByText("Index")).toBeInTheDocument();
    expect(screen.getByText("Elsewhere")).toBeInTheDocument();
    expect(screen.getAllByRole("list")).toHaveLength(2);
  });

  it("compact flattens the columns into one untitled row", () => {
    render(<Footer variant="compact" columns={columns} />);
    expect(screen.queryByText("Index")).not.toBeInTheDocument();
    expect(screen.queryByText("Elsewhere")).not.toBeInTheDocument();
    expect(screen.getAllByRole("list")).toHaveLength(1);
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  /** http means offsite. mailto and an in-page anchor do not. */
  it("derives the external target from the protocol", () => {
    render(<Footer columns={columns} />);
    const github = screen.getByRole("link", { name: /github/i });
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", expect.stringContaining("noopener"));

    const email = screen.getByRole("link", { name: /email/i });
    expect(email).not.toHaveAttribute("target");

    const about = screen.getByRole("link", { name: "About" });
    expect(about).not.toHaveAttribute("target");
  });

  it("lets a link override the derived target", () => {
    render(
      <Footer
        columns={[
          {
            title: "X",
            links: [{ label: "Docs", href: "/docs", external: true }],
          },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: /docs/i })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("renders the copyright and the trailing note", () => {
    render(
      <Footer columns={columns} copyright="© 2026" note="quality > quantity" />,
    );
    expect(screen.getByText("© 2026")).toBeInTheDocument();
    expect(screen.getByText("quality > quantity")).toBeInTheDocument();
  });

  it("omits the bottom bar when there is nothing to put in it", () => {
    const { container } = render(<Footer columns={columns} />);
    expect(container.querySelector("[data-footer-bottom]")).toBeNull();
  });

  it("always draws the hairline", () => {
    const { container } = render(<Footer columns={columns} />);
    expect(container.querySelector("[data-footer-rule]")).toBeInTheDocument();
  });

  /** The glows assume a dark page, so they are opt-in. */
  it("paints no glows unless asked", () => {
    const { container } = render(<Footer columns={columns} />);
    expect(container.querySelectorAll("[data-footer-glow]")).toHaveLength(0);
  });

  it("paints the glows when asked, hidden from assistive tech", () => {
    const { container } = render(<Footer glow columns={columns} />);
    const glows = container.querySelectorAll("[data-footer-glow]");
    expect(glows).toHaveLength(2);
    for (const g of glows) expect(g).toHaveAttribute("aria-hidden", "true");
  });

  it("gives each column an accessible name", () => {
    render(<Footer columns={columns} />);
    const nav = screen.getByRole("navigation", { name: "Elsewhere" });
    expect(within(nav).getByRole("link", { name: /github/i })).toBeVisible();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Footer
        glow
        brand={<span>usva.</span>}
        tagline="Designer by eye, dev by hand."
        columns={columns}
        copyright="© 2026 Mateusz Pasek"
        note="quality > quantity"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
