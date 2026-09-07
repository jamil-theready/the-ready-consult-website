"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   The hero story, in three acts. It is not decoration: it is the pitch.

     1  a real client site — H&S Insulation, hernandezinsulation.com
     2  the camera pushes in, and an AI assistant answers a buyer's question
        by naming them and citing the site
     3  the quote request lands

   Act one is drawn from the live site, not invented: dark utility bar, white
   header, the house-and-waves mark, NORCAL · SINCE 2016, the orange pill CTA
   and the attic hero. Its palette is the CLIENT's and deliberately outside the
   TRC amber (design rule 28), so these are literals:
     orange #F26A21 · ink #26292D · paper #FFFFFF
   --------------------------------------------------------------------------- */

const ACTS = 4;
const HOLD = [3600, 2400, 3400, 3200];
const QUERY = "landscaper near me";

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [typed, setTyped] = useState(0);

  // Starts on mount, NOT on intersection. An IntersectionObserver gate here
  // never fired and left the story frozen on act one — the same way the
  // engine's cue observer silently hid the hero. This element is above the
  // fold by definition, so the gate bought nothing and could only fail.
  useEffect(() => {
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setAct((a) => (a + 1) % ACTS), HOLD[act]);
    return () => clearTimeout(t);
  }, [act]);

  // Act one types the query out. It resets whenever the loop comes back round
  // so the second pass is not a line of text that is already finished.
  useEffect(() => {
    if (act !== 0) return;
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(QUERY.length);
      return;
    }
    setTyped(0);
    // The counter lives OUT here and the interval is cleared from the callback,
    // never from inside the state updater. Updaters must be pure: doing the
    // clearInterval in there froze the typing at "land" and stalled the whole
    // act loop with it.
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= QUERY.length) clearInterval(id);
    }, 95);
    return () => clearInterval(id);
  }, [act]);

  // the camera. Act 2 pushes in toward the address bar, act 3 eases back out
  // so the lead card has room to land.
  const cam =
    act <= 1 ? "scale(1) translate3d(0,0,0)"
    : act === 2 ? "scale(1.18) translate3d(0,-6%,0)"
    : "scale(1.06) translate3d(0,-2%,0)";

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden select-none">
      {/* ── ACT 1 — the close-up. Someone typing the query that starts the
             whole chain. Deliberately oversized: at hero scale this is the
             only text a visitor can read without leaning in, so it carries
             the idea on its own. Sits above every other layer and clears out
             once the site appears. ── */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-6"
           style={{
             background: "#0D0A05",
             opacity: act === 0 ? 1 : 0,
             pointerEvents: "none",
             transition: "opacity 700ms ease",
           }}>
        <div className="w-full max-w-[680px]">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: "#10a37f", color: "#fff" }}>AI</span>
            <span className="text-[15px] font-medium" style={{ color: "#BCAC8C" }}>ChatGPT</span>
          </div>

          {/* the input, blown up */}
          <div className="flex items-center gap-3 rounded-2xl px-6 py-5"
               style={{ background: "#16110A", border: "1px solid #2C2417" }}>
            <span className="font-medium leading-none whitespace-nowrap"
                  style={{ color: "#F7F0E2", fontSize: "clamp(26px, 3.4vw, 44px)", letterSpacing: "-0.02em" }}>
              {QUERY.slice(0, typed)}
              <span aria-hidden="true"
                    style={{ display: "inline-block", width: "3px", height: "1em",
                             marginLeft: "4px", verticalAlign: "-0.12em",
                             background: "var(--amber)",
                             animation: "hv-caret 1s steps(1) infinite" }} />
            </span>
          </div>

          <p className="mt-5 text-[14px]" style={{ color: "#9A8A6C" }}>
            This is how work starts now.
          </p>
        </div>
      </div>

      {/* ── the browser, and the camera that moves on it ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: cam, transition: "transform 1500ms cubic-bezier(.22,1,.36,1)" }}
      >
        <div className="w-full h-full flex flex-col overflow-hidden"
             style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #2C2417" }}>
          {/* chrome */}
          <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: "#16110A" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
            <div className="flex-1 mx-2 h-5 rounded flex items-center px-2"
                 style={{ background: "#0D0A05", border: "1px solid #2C2417" }}>
              <span className="text-[9px]" style={{ color: "#BCAC8C" }}>hernandezinsulation.com</span>
            </div>
          </div>

          {/* utility bar */}
          <div className="flex items-center justify-between px-4 py-1.5 shrink-0" style={{ background: "#26292D" }}>
            <span className="text-[7px]" style={{ color: "#C7CBD0" }}>
              Insulation contractor · Northern California · Since 2016
            </span>
            <span className="text-[7px]" style={{ color: "#C7CBD0" }}>+1 (916) 912-2080</span>
          </div>

          {/* header */}
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0" style={{ background: "#FFFFFF" }}>
            <div className="flex items-center gap-2 min-w-0">
              {/* house + waves, as on the real mark */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"
                      stroke="#26292D" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 12.5c1.6-1 3.4-1 5 0s3.4 1 5 0M7 15.5c1.6-1 3.4-1 5 0s3.4 1 5 0"
                      stroke="#F26A21" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <div className="leading-none min-w-0">
                <div className="text-[9px] font-bold tracking-tight truncate" style={{ color: "#26292D" }}>
                  H&amp;S INSULATION
                </div>
                <div className="text-[5px] tracking-[0.18em] mt-0.5" style={{ color: "#8A9099" }}>
                  NORCAL · SINCE 2016
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              {["Services", "Service Areas", "About", "FAQ", "Blog", "Contact"].map((l) => (
                <span key={l} className="text-[6px]" style={{ color: "#26292D" }}>{l}</span>
              ))}
              <span className="text-[6px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "#F26A21", color: "#fff" }}>
                Get a Free Estimate
              </span>
            </div>
          </div>

          {/* hero: the attic, and their wave motif */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0" style={{
              background:
                "radial-gradient(120% 100% at 62% 55%, rgba(214,150,96,.30) 0%, rgba(40,32,26,.92) 58%, #1A1512 100%)",
            }} />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <path key={i}
                      d={`M${300 + i * 22} 0 C ${288 + i * 22} 46, ${312 + i * 22} 92, ${300 + i * 22} 138 S ${288 + i * 22} 184, ${300 + i * 22} 200`}
                      stroke="#F26A21" strokeWidth="1" fill="none" opacity={0.32 - i * 0.05} />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
              <p className="text-[12px] font-semibold leading-snug max-w-[240px]" style={{ color: "#FFFFFF" }}>
                A more comfortable home, sealed tight and done clean.
              </p>
              <p className="text-[7px] mt-1.5 max-w-[240px]" style={{ color: "#D6D2CC" }}>
                Attic, wall and crawlspace insulation across Yuba City and Northern California.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACT 2 — the AI answer ── */}
      {/* Centred by flex, not by left-1/2 + a translate: the inline transform
          carrying the scale was overwriting the centring translate, which left
          the panel sitting off to the left. text-left because the hero section
          sets text-center and the panel would otherwise inherit it. */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none text-left">
      <div className="w-[74%] max-w-[430px]"
           style={{
             opacity: act >= 2 ? 1 : 0,
             transform: `scale(${act >= 2 ? 1 : 0.94})`,
             transition: "opacity 620ms ease, transform 700ms cubic-bezier(.22,1,.36,1)",
           }}>
        <div className="overflow-hidden"
             style={{ background: "#16110A", border: "1px solid #2C2417", borderRadius: 12,
                      boxShadow: "0 30px 70px -20px rgba(0,0,0,.75)" }}>
          <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid #2C2417" }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold"
                  style={{ background: "#10a37f", color: "#fff" }}>AI</span>
            <span className="text-[8px] font-medium" style={{ color: "#F7F0E2" }}>Assistant</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="ml-auto w-fit max-w-[85%] px-2.5 py-1.5 rounded-lg"
                 style={{ background: "#2C2417" }}>
              <span className="text-[8px]" style={{ color: "#F7F0E2" }}>
                Who insulates attics near Yuba City?
              </span>
            </div>
            <div className="max-w-[92%]">
              <span className="text-[8px] leading-relaxed" style={{ color: "#D2C4A6" }}>
                For attic insulation around Yuba City,{" "}
                <span style={{ color: "#F26A21", fontWeight: 600 }}>H&amp;S Insulation</span>{" "}
                is a strong choice — licensed and insured, working across Northern
                California since 2016.
              </span>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: "#F26A21" }} />
                <span className="text-[7px] underline" style={{ color: "#E9A63C" }}>
                  hernandezinsulation.com ↗
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ── ACT 3 — the lead ── */}
      <div className="absolute right-3 bottom-3 w-[60%] max-w-[300px] text-left"
           style={{
             opacity: act === 3 ? 1 : 0,
             transform: `translateY(${act === 3 ? 0 : 16}px)`,
             transition: "opacity 520ms ease, transform 620ms cubic-bezier(.22,1,.36,1)",
             pointerEvents: "none",
           }}>
        <div className="flex items-start gap-2.5 p-3"
             style={{ background: "#0D0A05", border: "1px solid #2C2417", borderRadius: 12,
                      boxShadow: "0 26px 60px -22px rgba(0,0,0,.8)" }}>
          <span className="w-5 h-5 rounded-full shrink-0 mt-0.5"
                style={{ background: "#E9A63C", boxShadow: "0 0 18px rgba(233,166,60,.55)" }} />
          <div className="min-w-0">
            <div className="text-[9px] font-semibold" style={{ color: "#F7F0E2" }}>
              New quote request
            </div>
            <div className="text-[7px] mt-0.5" style={{ color: "#BCAC8C" }}>
              Attic insulation · Elk Grove · via AI referral
            </div>
          </div>
          <span className="ml-auto text-[6px] shrink-0" style={{ color: "#9A8A6C" }}>now</span>
        </div>
      </div>

      {/* act indicator — three seams, the active one lit */}
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-[2px] rounded-full"
                style={{ width: i === act ? 18 : 8,
                         background: i === act ? "var(--amber)" : "var(--seam)",
                         transition: "width 400ms var(--ease), background 400ms var(--ease)" }} />
        ))}
      </div>
    </div>
  );
}
