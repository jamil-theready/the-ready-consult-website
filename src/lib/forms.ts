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
 * ⛔ ONE STEP REMAINS, AND ONLY JAMIL CAN DO IT.
 * Web3Forms is behind a Cloudflare bot check and Google OAuth, so it cannot be
 * automated. Two minutes:
 *   1. web3forms.com → sign in as jamil@thereadyconsult.com
 *   2. Create an access key for "The Ready Consult — Site" with the inbox set
 *      to jamil@thereadyconsult.com
 *   3. Paste it below, replacing null, and deploy
 * Then send one test through /contact using 916-555-01xx and confirm it lands.
 *
 * Until that is done the form does NOT silently fail: it says it cannot take
 * the message and offers the call and the email address instead.
 */
export const WEB3FORMS_KEY: string | null = null;

/**
 * ⛔ Leave this null. Turnstile is a Web3Forms PRO feature: on the free plan a
 * real sitekey makes the widget render, the visitor solve it, and the API
 * reject the submission with a 400 — while the page says "Success". The
 * honeypot below is what actually catches bots here.
 */
export const TURNSTILE_SITEKEY: string | null = null;

/** Where a lead lands. Filters forward from here — never change one alone. */
export const LEAD_INBOX = "jamil@thereadyconsult.com";
