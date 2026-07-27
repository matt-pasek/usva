import { describe, expect, it } from "vitest";
import { classifyCaller } from "./caller";

const headers = (init: Record<string, string>) => new Headers(init);

describe("classifyCaller", () => {
  it("reads a bare fetch as the cli", () => {
    expect(classifyCaller(headers({ accept: "*/*" }))).toBe("cli");
  });

  it("reads sec-fetch headers as a browser", () => {
    expect(
      classifyCaller(
        headers({ "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" }),
      ),
    ).toBe("browser");
  });

  it("reads an html accept as a browser even without sec-fetch", () => {
    expect(
      classifyCaller(headers({ accept: "text/html,application/xhtml+xml" })),
    ).toBe("browser");
  });

  it("reads a crawler as a bot before anything else", () => {
    expect(
      classifyCaller(
        headers({
          "user-agent": "Googlebot/2.1",
          "sec-fetch-mode": "navigate",
        }),
      ),
    ).toBe("bot");
  });

  it("does not mistake a cors fetch from a page for the cli", () => {
    expect(
      classifyCaller(headers({ "sec-fetch-mode": "cors", accept: "*/*" })),
    ).toBe("browser");
  });
});
