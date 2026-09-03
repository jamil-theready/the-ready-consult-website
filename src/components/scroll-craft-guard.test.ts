import { describe, it, expect, beforeEach } from "vitest";
import { mountOnce, resetForTests, type ScrollCraftApi, type ScrollCraftEngine } from "./scroll-craft-guard";

// The guard never touches the root, it only hands it to the engine.
const ROOT = {} as unknown as Element;

function fakeEngine(calls: string[]): { engine: ScrollCraftEngine; api: ScrollCraftApi } {
  const api: ScrollCraftApi = { layout: () => calls.push("layout"), read: () => {} };
  const engine: ScrollCraftEngine = {
    mount: () => { calls.push("mount"); return api; },
    instances: [],
  };
  return { engine, api };
}

describe("mountOnce", () => {
  beforeEach(() => resetForTests());

  it("mounts on first call and returns the api", () => {
    const calls: string[] = [];
    const { engine, api } = fakeEngine(calls);
    expect(mountOnce(engine, ROOT)).toBe(api);
    expect(calls).toEqual(["mount"]);
  });

  it("does not mount twice, it re-layouts instead", () => {
    const calls: string[] = [];
    const { engine } = fakeEngine(calls);
    mountOnce(engine, ROOT);
    mountOnce(engine, ROOT);
    mountOnce(engine, ROOT);
    expect(calls).toEqual(["mount", "layout", "layout"]);
  });

  it("returns null when the engine has not loaded yet", () => {
    expect(mountOnce(undefined, ROOT)).toBeNull();
  });
});
