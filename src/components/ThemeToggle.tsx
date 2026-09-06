"use client";

const KEY = "trc-theme";

/**
 * Light/dark toggle.
 *
 * Deliberately holds NO React state. The current theme lives in one place —
 * `data-theme` on <html> — set by a blocking script in the document head
 * before first paint. Both icons are always rendered and CSS picks which one
 * shows, so the server and client markup are byte-identical: no hydration
 * mismatch, and no flash of the wrong theme on load.
 *
 * Seeding state from localStorage in an effect is the trap here: it renders
 * one theme, then swaps after paint.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // private mode, or site data blocked. The toggle still works for this
      // page view; it just will not be remembered.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark"
      title="Switch between light and dark"
      className={`inline-flex items-center justify-center w-9 h-9 text-gray-500 hover:text-amber border border-transparent hover:border-seam transition-colors duration-300 ${className}`}
    >
      {/* shown in DARK: click to go light */}
      <svg className="theme-ico-sun" width="17" height="17" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
      </svg>
      {/* shown in LIGHT: click to go dark */}
      <svg className="theme-ico-moon" width="17" height="17" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1Z" />
      </svg>
    </button>
  );
}
