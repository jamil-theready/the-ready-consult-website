"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* The trades we actually sell to. Keep them singular and adjectival: every one
   has to read correctly in "AI solutions for your ___ business." */
export const TRADES = [
  "landscaping",
  "construction",
  "masonry",
  "concrete",
  "hardscape",
  "pool",
];

const HOLD_MS = 2600;
const SWAP_MS = 420;

/* Only the live word is ever in the document, plus the one leaving during the
   420ms swap. Rendering all six and hiding five put every trade inside the h1
   in the served HTML, which reads as one garbled sentence to anything that
   does not run the CSS. That is the wrong trade to make on the one element
   the whole page ranks on.

   The live word sits in normal flow, so it owns the line box, the baseline and
   the accessible text. The slot's width is measured from it and transitioned,
   because an auto width jumps between "pool" and "construction" on the frame
   the word changes. */
export default function RotatingWord() {
  const [i, setI] = useState(0);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const live = useRef<HTMLSpanElement>(null);

  // The slot is measured from the live word and the width is transitioned, so
  // the heading re-centres smoothly instead of jumping. Pinning it to the
  // widest trade held the line still but left a dead gap after short words.
  const measure = () => {
    if (live.current) setWidth(live.current.offsetWidth);
  };

  // Before paint, so the width transition starts from the previous word's box.
  useLayoutEffect(measure, [i]);

  useEffect(() => {
    // A web font landing after first paint changes every word's width, and the
    // slot would otherwise keep the fallback font's measurement for good.
    if (document.fonts) document.fonts.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = setInterval(() => {
      setI((n) => (n + 1) % TRADES.length);
    }, HOLD_MS);
    return () => clearInterval(tick);
  }, []);

  return (
    <span className="rw" style={width ? { width } : undefined}>
      <span className="rw__in" key={i} ref={live}>
        {TRADES[i]}
      </span>
    </span>
  );
}
