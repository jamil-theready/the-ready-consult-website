/**
 * Form configuration for thereadyconsult.com.
 *
 * 🔴 WHY THIS FILE EXISTS (2026-09-04)
 * The intake form read its key from `process.env.NEXT_PUBLIC_WEB3FORMS_KEY`.
 * That variable was never set — not in a local `.env`, not in the Cloudflare
 * Pages project — so Next inlined nothing and the shipped bundle contained the
 * literal expression `access_key: t.default.env.NEXT_PUBLIC_WEB3FORMS_KEY`.
 * In the browser that evaluates to `undefined`, so every submission on /start
 * was rejected by Web3Forms. The form looked finished and could not take a lead.
 *
 * Every client site keeps its key as a plain constant here for exactly this
 * reason: a Web3Forms access key is a public, client-side identifier — it ships
 * in the JavaScript of all thirteen sites — so there is nothing to protect by
 * hiding it in an env var, and an env var is one more thing that can silently
 * be missing at build time.
 *
 * ✅ LIVE since 2026-09-04 — form "TRC Contact form", created by Jamil.
 * Verified end to end with a real browser submission from /contact.
 *
 * If this is ever set back to null the form does NOT silently fail: it says it
 * cannot take the message and offers the call and the email address instead.
 */
export const WEB3FORMS_KEY: string | null = "ceeca694-d4b0-4e82-ba31-26508257f8d6";

/**
 * ⛔ Leave this null. Turnstile is a Web3Forms PRO feature: on the free plan a
 * real sitekey makes the widget render, the visitor solve it, and the API
 * reject the submission with a 400 — while the page says "Success". The
 * honeypot below is what actually catches bots here.
 */
export const TURNSTILE_SITEKEY: string | null = null;

/** Where a lead lands. Filters forward from here — never change one alone. */
export const LEAD_INBOX = "jamil@thereadyconsult.com";
