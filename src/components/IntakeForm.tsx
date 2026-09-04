"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { WEB3FORMS_KEY } from "@/lib/forms";

const TRADES = [
  "Masonry / brick / stone",
  "Concrete / paving",
  "Hardscape / retaining walls",
  "Pools / gunite",
  "Landscaping",
  "Painting",
  "Stucco / plaster",
  "Fencing / decks",
  "Roofing",
  "Other trade",
];

const NEEDS = [
  { v: "leads", t: "More jobs / more customers", s: "Ready to spend on getting the phone to ring" },
  { v: "website", t: "I need a website", s: "Don't have one, or the one I have is bad" },
  { v: "notfound", t: "I have a website but nobody calls", s: "It exists, it just isn't working" },
  { v: "question", t: "Just have a question", s: "Not looking to hire anyone right now" },
];

const CONTACT_METHODS = ["WhatsApp", "Phone call", "Text message"];

// Vocabulary agencies use when they cold-pitch us. Two or more hits = held for review.
const PITCH_TERMS = [
  "seo service", "seo agency", "first page", "rank higher", "backlink", "link building",
  "we noticed", "we came across", "digital marketing agency", "outsourcing", "offshore",
  "web development company", "increase your traffic", "guest post", "dofollow",
  "our team of experts", "affordable price", "partnership opportunity",
];

const LABEL = "block text-[13px] font-semibold text-navy mb-2";
const INPUT =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-navy " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent";

type Status = "idle" | "sending" | "sent" | "error";

export default function IntakeForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const router = useRouter();
  const [need, setNeed] = useState("");
  const [how, setHow] = useState("WhatsApp");
  const loadedAt = useRef<number>(0);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) ?? "").toString().trim();

    // 1. Honeypot — invisible to people, irresistible to bots. Send nothing, and
    // show the thank-you page so the bot has no signal to retry against.
    if (get("website_url")) {
      router.push("/thank-you");
      return;
    }

    // 2. Speed. This used to discard anything submitted within four seconds the
    // same way as the honeypot — a fake success and no send. Browser autofill
    // fills name, business, city and phone in about a second, so a real
    // contractor with autofill on got "Got it" and became no lead at all, and
    // there was no way to know it had happened. Speed alone is not proof of a
    // bot: it is now a FLAG on a message that still gets sent, and the honeypot
    // above stays the thing that actually blocks.
    const fast = Date.now() - loadedAt.current < 4000;

    // 3. Required fields
    const missing: string[] = [];
    if (!get("name")) missing.push("your name");
    if (!get("biz")) missing.push("business name");
    if (!get("trade")) missing.push("your trade");
    if (!get("city")) missing.push("city");
    if (!get("phone")) missing.push("phone");
    if (!need) missing.push("what you need");
    if (missing.length) {
      setError(`Still need: ${missing.join(", ")}.`);
      return;
    }

    // 4. Pitch-language scan — routes agencies to review instead of the leads list.
    // Scans the whole submission, not just the message: an agency pitch often
    // arrives with the sales language in the business name ("Growth Partners
    // SEO") and the message left short or empty, which slipped straight through
    // when only `msg` was read.
    const msg = [get("msg"), get("biz"), get("name"), get("city")]
      .join(" ").toLowerCase();
    const hits = PITCH_TERMS.filter((p) => msg.includes(p));
    const flagged = hits.length >= 2;

    // No key, no request. Posting without one returns a Web3Forms error that
    // reads like the visitor's fault; saying so plainly and handing them the
    // call and the email address is honest and still captures the lead.
    if (!WEB3FORMS_KEY) {
      setStatus("error");
      setError(
        "This form isn't taking messages right now. Book a call at " +
          "calendly.com/thereadyconsult/30min or email team@thereadyconsult.com — " +
          "both reach us straight away."
      );
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: flagged
            ? `[REVIEW — likely agency] ${get("biz")}`
            : fast
              ? `[CHECK — fast submit] ${get("biz")}`
              : `New lead from thereadyconsult.com — ${get("biz")}`,
          from_name: "The Ready Consult",
          name: get("name"),
          business: get("biz"),
          trade: get("trade"),
          city: get("city"),
          phone: get("phone"),
          needs: need,
          contact_via: how,
          message: get("msg"),
          routing: flagged ? "REVIEW_QUEUE" : need,
          spam_flags: [hits.join(", "), fast ? "submitted in under 4s" : ""]
            .filter(Boolean).join(" · ") || "none",
          lead_page: typeof window !== "undefined" ? window.location.pathname : "",
          lead_referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Submission failed");
      setStatus("sent");
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? `${err.message} — or just text us at (916) 555-0100.`
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 sm:p-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cyan">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-navy">Got it.</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-600">
          We&rsquo;re pulling up your Google listing now. You&rsquo;ll get a short video showing
          what&rsquo;s costing you calls — on {how.toLowerCase()}, within a few hours. No charge.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="name">Your name</label>
          <input id="name" name="name" autoComplete="name" className={INPUT} placeholder="Jorge Lizama" />
        </div>
        <div>
          <label className={LABEL} htmlFor="biz">Business name</label>
          <input id="biz" name="biz" autoComplete="organization" className={INPUT} placeholder="JALA Detail Painting" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="trade">What kind of work do you do?</label>
          <select id="trade" name="trade" className={INPUT} defaultValue="">
            <option value="" disabled>Select your trade…</option>
            {TRADES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="city">City you work in</label>
          <input id="city" name="city" className={INPUT} placeholder="Sacramento, CA" />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="phone">Phone / WhatsApp</label>
        <input id="phone" name="phone" inputMode="tel" autoComplete="tel" className={INPUT} placeholder="(916) 555-0123" />
      </div>

      <fieldset>
        <legend className={LABEL}>What do you need?</legend>
        <div className="space-y-2">
          {NEEDS.map((n) => (
            <label
              key={n.v}
              className={`flex cursor-pointer gap-3 rounded-lg border px-4 py-3 transition-colors ${
                need === n.v ? "border-cyan bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <input
                type="radio" name="need" value={n.v} checked={need === n.v}
                onChange={() => setNeed(n.v)} className="mt-1 accent-cyan"
              />
              <span>
                <span className="block text-[15px] font-semibold text-navy">{n.t}</span>
                <span className="block text-[13px] leading-snug text-gray-500">{n.s}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={LABEL}>How should we reach you?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_METHODS.map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors ${
                how === m ? "border-cyan bg-cyan text-white" : "border-gray-200 bg-white text-navy hover:border-gray-400"
              }`}
            >
              <input type="radio" name="how" value={m} checked={how === m} onChange={() => setHow(m)} className="sr-only" />
              {m}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={LABEL} htmlFor="msg">Anything else? <span className="font-normal text-gray-400">(optional)</span></label>
        <textarea id="msg" name="msg" rows={4} className={INPUT} placeholder="Tell us what's going on with your business…" />
      </div>

      {/* Honeypot — hidden from people, bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website_url">Company website</label>
        <input id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-[14px] font-medium text-cyan">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-cyan px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send — get my free review"}
      </button>

      <p className="text-[12px] leading-relaxed text-gray-400">
        By submitting, you agree we can contact you by WhatsApp, text or phone about your business.
        We never share your information.
      </p>
    </form>
  );
}
