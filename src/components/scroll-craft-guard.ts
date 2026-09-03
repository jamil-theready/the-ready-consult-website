export type ScrollCraftApi = { layout: () => void; read: () => void };

export type ScrollCraftEngine = {
  mount: (root?: Element | Document | string, opts?: { lerp?: number }) => ScrollCraftApi;
  instances: ScrollCraftApi[];
};

// The engine attaches a rAF loop, scroll and resize listeners and
// IntersectionObservers, and exposes no destroy path. Mounting twice leaks a
// second loop for the life of the page, so the guard is module level rather
// than a ref: a ref resets on remount, which is exactly the case we guard.
let mounted: ScrollCraftApi | null = null;

// The root is passed in rather than read from `document` here, so the guard
// stays a pure decision the test can drive without a DOM.
export function mountOnce(
  engine: ScrollCraftEngine | undefined,
  root: Element | Document,
): ScrollCraftApi | null {
  if (!engine) return null;
  if (mounted) {
    mounted.layout();
    return mounted;
  }
  mounted = engine.mount(root);
  return mounted;
}

export function resetForTests() {
  mounted = null;
}
