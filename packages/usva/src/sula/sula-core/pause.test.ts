import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPauseGate } from "./pause.js";

type Callback = (entries: Array<{ isIntersecting: boolean }>) => void;

const observers: Array<{ callback: Callback; disconnect: () => void }> = [];

class FakeObserver {
  callback: Callback;
  disconnect = vi.fn();
  constructor(callback: Callback) {
    this.callback = callback;
    observers.push(this);
  }
  observe = vi.fn();
  unobserve = vi.fn();
}

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => hidden,
  });
  document.dispatchEvent(new Event("visibilitychange"));
};

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => false,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createPauseGate", () => {
  const mount = () => {
    const target = document.createElement("div");
    const onPause = vi.fn();
    const onResume = vi.fn();
    const gate = createPauseGate({ target, onPause, onResume });
    const observer = observers[0];
    if (!observer) throw new Error("no observer");
    return { gate, onPause, onResume, observer };
  };

  it("starts awake and fires nothing on mount", () => {
    const { gate, onPause, onResume } = mount();
    expect(gate.awake()).toBe(true);
    expect(onPause).not.toHaveBeenCalled();
    expect(onResume).not.toHaveBeenCalled();
  });

  it("pauses offscreen and resumes on return", () => {
    const { gate, onPause, onResume, observer } = mount();
    observer.callback([{ isIntersecting: false }]);
    expect(gate.awake()).toBe(false);
    expect(onPause).toHaveBeenCalledTimes(1);
    observer.callback([{ isIntersecting: true }]);
    expect(gate.awake()).toBe(true);
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it("pauses in a hidden tab even while on screen", () => {
    const { gate, onPause, onResume } = mount();
    setHidden(true);
    expect(gate.awake()).toBe(false);
    expect(onPause).toHaveBeenCalledTimes(1);
    setHidden(false);
    expect(gate.awake()).toBe(true);
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it("does not resume an offscreen surface when the tab comes back", () => {
    const { gate, onResume, observer } = mount();
    observer.callback([{ isIntersecting: false }]);
    setHidden(true);
    setHidden(false);
    expect(gate.awake()).toBe(false);
    expect(onResume).not.toHaveBeenCalled();
  });

  it("reports transitions only, never repeats", () => {
    const { onPause, observer } = mount();
    observer.callback([{ isIntersecting: false }]);
    observer.callback([{ isIntersecting: false }]);
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it("treats any overlap as visible, so chrome at the edge keeps drawing", () => {
    const { gate, onPause, observer } = mount();
    observer.callback([{ isIntersecting: true }]);
    expect(gate.awake()).toBe(true);
    expect(onPause).not.toHaveBeenCalled();
  });

  it("drops its listeners on dispose", () => {
    const { gate, onPause, observer } = mount();
    gate.dispose();
    expect(observer.disconnect).toHaveBeenCalled();
    setHidden(true);
    expect(onPause).not.toHaveBeenCalled();
  });
});
