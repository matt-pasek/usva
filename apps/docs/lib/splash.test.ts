import { beforeEach, describe, expect, it, vi } from "vitest";
import { SPLASH_LEAD_S, splashLead } from "./splash";
import { SPLASH_MS, splashScript } from "./splash-script";

type NavType = "navigate" | "reload" | "back_forward";

function stubBrowser({
  navigation = "navigate" as NavType,
  reduce = false,
  legacyOnly = false,
} = {}) {
  const dataset: Record<string, string> = {};

  vi.stubGlobal("document", {
    documentElement: {
      dataset,
      setAttribute: (name: string, value: string) => {
        if (name.startsWith("data-")) dataset[name.slice(5)] = value;
      },
    },
  });
  vi.stubGlobal("performance", {
    getEntriesByType: () => (legacyOnly ? [] : [{ type: navigation }]),
    navigation: { type: navigation === "navigate" ? 0 : 1 },
  });
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reduce })),
  );

  return dataset;
}

/** Runs the blocking script the way the browser does. */
const runScript = () => {
  new Function(splashScript)();
};

describe("splash gate", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks an arrival", () => {
    const dataset = stubBrowser({ navigation: "navigate" });
    runScript();
    expect(dataset.splash).toBe("1");
  });

  it("marks a second arrival in the same tab", () => {
    const dataset = stubBrowser({ navigation: "navigate" });
    runScript();
    delete dataset.splash;

    runScript();
    expect(dataset.splash).toBe("1");
  });

  it("withholds the mark on a reload", () => {
    const dataset = stubBrowser({ navigation: "reload" });
    runScript();
    expect(dataset.splash).toBeUndefined();
  });

  it("withholds the mark on back and forward", () => {
    const dataset = stubBrowser({ navigation: "back_forward" });
    runScript();
    expect(dataset.splash).toBeUndefined();
  });

  it("withholds the mark under reduced motion", () => {
    const dataset = stubBrowser({ navigation: "navigate", reduce: true });
    runScript();
    expect(dataset.splash).toBeUndefined();
  });

  it("falls back to the legacy navigation type", () => {
    const arrival = stubBrowser({ navigation: "navigate", legacyOnly: true });
    runScript();
    expect(arrival.splash).toBe("1");

    const reload = stubBrowser({ navigation: "reload", legacyOnly: true });
    runScript();
    expect(reload.splash).toBeUndefined();
  });
});

describe("splash lead", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("is nothing when no splash is playing", () => {
    stubBrowser({ navigation: "reload" });
    expect(splashLead()).toBe(0);
  });

  it("is the lead while the splash is playing", () => {
    stubBrowser({ navigation: "navigate" });
    runScript();
    expect(splashLead()).toBe(SPLASH_LEAD_S);
  });

  it("is nothing again once the cover has cleared its mark", () => {
    const dataset = stubBrowser({ navigation: "navigate" });
    runScript();
    expect(splashLead()).toBe(SPLASH_LEAD_S);

    delete dataset.splash;
    expect(splashLead()).toBe(0);
  });

  it("lands before the cover is gone, so the two gestures overlap", () => {
    expect(SPLASH_LEAD_S * 1000).toBeLessThan(SPLASH_MS);
  });
});
