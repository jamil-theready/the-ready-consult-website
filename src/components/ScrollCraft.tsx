"use client";

import { useEffect } from "react";
import Script from "next/script";
import { mountOnce, type ScrollCraftEngine } from "./scroll-craft-guard";

declare global {
  interface Window {
    ScrollCraft?: ScrollCraftEngine;
  }
}

// Mounting before the loading screen resolves measures every act at zero
// height, which is a failure this repo has already hit once. Gate on `ready`,
// then poll a frame at a time until the engine script has actually landed.
export default function ScrollCraft({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const attempt = () => {
      if (mountOnce(window.ScrollCraft, document.body)) return;
      raf = requestAnimationFrame(attempt);
    };
    attempt();
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return <Script src="/scrollcraft.js" strategy="afterInteractive" />;
}
