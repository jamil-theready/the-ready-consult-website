"use client";

import { useEffect, useRef } from "react";

/* Modelled on the reference site's About block. Three paragraphs in one narrow
   column, all sitting dimmed, with whichever one is nearest the middle of the
   screen lit to full. Reading is what drives it, so the section is a plain flow
   act: pinning it would hold the paragraphs still while the effect wants them
   travelling past the centre line.
   
   The falloff is the reference's own curve: full brightness inside a tenth of a
   0.42-viewport band either side of centre, then a linear fade to a floor. The
   floor is raised from their 0.22 because ours is dark ink on a light ground,
   where 0.22 is far fainter than light ink on a dark one.

   PROOF LINE: a count of businesses running the system belongs in this section.
   It is deliberately absent until it can be read from live Stripe. An
   unverified figure on a public page is exactly the failure the standing rules
   warn about. Add it the moment Stripe livemode is reachable. */
const FLOOR = 0.28;

export default function Mission() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ps = Array.from(root.querySelectorAll<HTMLElement>(".mission__p"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let live = false;
    const paint = () => {
      const vh = window.innerHeight;
      for (const p of ps) {
        const r = p.getBoundingClientRect();
        const centre = r.top + r.height / 2;
        const d = Math.abs(centre - vh * 0.5) / (vh * 0.42);
        const o = Math.max(FLOOR, 1 - Math.max(0, d - 0.1) * 1.3);
        p.style.opacity = o.toFixed(3);
      }
      raf = live ? requestAnimationFrame(paint) : 0;
    };

    // The loop only runs while the section is near the viewport. A permanent
    // rAF reading three rects for the whole life of the page is a layout read
    // per frame that the reader is not paying for anywhere else.
    const io = new IntersectionObserver(
      (entries) => {
        live = entries[0].isIntersecting;
        if (live && !raf) raf = requestAnimationFrame(paint);
        if (!live) ps.forEach((p) => (p.style.opacity = String(FLOOR)));
      },
      { rootMargin: "25% 0px" }
    );
    io.observe(root);

    return () => {
      live = false;
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="about"
      className="sc-section mission"
      data-sc-act="flow"
      data-sc-drift="#f6f9fc"
    >
      <div className="mission__inner">
        <p className="mission__p">
          You get a <em className="mission__k">website</em> and a{" "}
          <em className="mission__k">Google Business Profile</em> built to book jobs.
          Real photos, your service areas, a call button on every screen.
        </p>
        <p className="mission__p">
          Then <em className="mission__k">monthly SEO</em> and{" "}
          <em className="mission__k">blog content</em> keep you coming up when people
          nearby search your trade. Want work sooner, we run{" "}
          <em className="mission__k">Google Ads</em> and{" "}
          <em className="mission__k">Meta Ads</em>.
        </p>
        <p className="mission__p">
          Every call and form is followed up automatically, and your{" "}
          <em className="mission__k">dashboard</em> shows where the work came from.
          One system. You stay on the job.
        </p>
      </div>
    </section>
  );
}
