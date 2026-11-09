"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./SubscriptionStory.module.css";

const sampleAnswer = "Helpful service pages make your business easier to find.";
const sampleLeads = [
  { name: "Alex Carter", message: "Can I get an estimate?" },
  { name: "Jordan Lee", message: "Can you call me today?" },
  { name: "Sam Rivera", message: "I need help with a project." },
];

function Gauge({ label, score, active, delay }: { label: string; score: number; active: boolean; delay: number }) {
  const [value, setValue] = useState(score);
  useEffect(() => {
    if (!active) return;
    setValue(0);
    let frame = 0;
    let timeout = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1700);
        setValue(Math.round(score * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => { window.clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [active, delay, score]);

  return <div className={styles.gauge}>
    <div className={styles.gaugeRing}>
      <svg viewBox="0 0 70 70" aria-hidden="true">
        <circle className={styles.gaugeTrack} cx="35" cy="35" r="28" />
        <circle className={styles.gaugeProgress} cx="35" cy="35" r="28" style={{ strokeDashoffset: 176 * (1 - value / 100) }} />
      </svg>
      <strong>{value}</strong>
    </div>
    <span>{label}</span>
  </div>;
}

export default function SubscriptionStory() {
  const seoRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [typed, setTyped] = useState(sampleAnswer);

  useEffect(() => {
    const el = seoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    setTyped("");
    let interval = 0;
    const timeout = window.setTimeout(() => {
      let count = 0;
      interval = window.setInterval(() => {
        count += 1;
        setTyped(sampleAnswer.slice(0, count));
        if (count >= sampleAnswer.length) window.clearInterval(interval);
      }, 26);
    }, 1800);
    return () => { window.clearTimeout(timeout); window.clearInterval(interval); };
  }, [active]);

  return <section id="services" className={styles.section} aria-labelledby="subscription-story-title">
    <div className={styles.inner}>
      <h2 id="subscription-story-title" className={styles.title}>Yes. One subscription.</h2>
      <p className={styles.intro}>We build your site, improve how customers find it, and show you what’s working.</p>

      <div className={styles.hub}><span className={styles.hubMark} aria-hidden="true">⠿</span>What&apos;s included</div>
      <div className={styles.connector} aria-hidden="true" />

      <div className={styles.step}>
        <h3>New website.</h3>
        <div className={styles.actualSite}>
          <Image src="/images/offer/hs-service-actual.png" alt="H&S Insulation service page built by The Ready Consult" width={1440} height={900} sizes="(max-width: 720px) 90vw, 920px" />
        </div>
        <p className={styles.caption}>A real service page we built for H&amp;S Insulation.</p>
      </div>

      <div className={styles.connector} aria-hidden="true" />
      <div className={styles.step}>
        <h3>Monthly SEO + reporting.</h3>
        <div ref={seoRef} className={styles.seoShowcase} aria-label="Illustrative monthly SEO animation">
          <div className={styles.seoHead}><span className={styles.googleG} aria-hidden="true">G</span><strong>Your SEO. Handled every month.</strong><small>Illustrative preview</small></div>
          <div className={styles.gauges}>
            <Gauge label="SEO" score={99} active={active} delay={400} />
            <Gauge label="Performance" score={100} active={active} delay={700} />
            <Gauge label="Accessibility" score={98} active={active} delay={1000} />
          </div>
          <div className={styles.signals}>
            <div className={styles.signal}><b>✦ &nbsp; AI search</b><p>{typed}<span className={styles.caret} aria-hidden="true" /></p></div>
            <div className={styles.signal}><b>↗ &nbsp; Search activity</b>
              <div className={`${styles.mailLine} ${active ? styles.isActive : ""}`}><strong>New search query</strong><span>Service page found</span></div>
              <div className={`${styles.mailLine} ${active ? styles.isActive : ""}`}><strong>Monthly update</strong><span>Report ready to review</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.connector} aria-hidden="true" />
      <div className={styles.step}>
        <h3>Leads delivered.</h3>
        <p className={styles.leadDescription}>Their name. Their details. Their message.<br />Sent straight to your WhatsApp.</p>
        <div className={styles.phoneCrop} aria-label="Illustrative incoming lead notifications">
          <div className={styles.phone}>
            <div className={styles.screen}>
              <span className={styles.island} aria-hidden="true" />
              <div className={styles.status}><b>9:41</b><span>▮▮▮ ◖ ◔</span></div>
              <div className={styles.notifications}>
                {sampleLeads.map(({ name, message }) => <div key={name} className={styles.notification}>
                  <span className={styles.whatsappIcon} aria-hidden="true">✆</span>
                  <div className={styles.notificationCopy}><small>WHATSAPP · THE READY CONSULT</small><b>New lead: {name}</b><p>“{message}”</p></div>
                  <em>now</em>
                </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.disclosure}>SEO scores and lead notifications are illustrative examples.</p>
    </div>
  </section>;
}
