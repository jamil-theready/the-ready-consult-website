import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const source = readFileSync(join(process.cwd(), 'public/assets/five-step-intake-live.js'), 'utf8');
const firstId = 'c71468b1-f325-43da-b5b8-78aa4a53d940';
const nextId = 'd71468b1-f325-43da-b5b8-78aa4a53d940';
const input = {
  firstName: ' Alex ', lastName: 'Carter', email: 'ALEX@example.com', businessName: 'Oakline Roofing',
  servicesOffered: 'Roof repair and installation', serviceAreas: 'Sacramento and Roseville',
  preferredContact: 'WHATSAPP', phone: '+1 (202) 555-0142',
  hasWebsite: 'YES', websiteUrl: 'oakline.example/services', hasDomain: 'YES', ownedDomain: 'oakline.example',
  hasGoogleBusinessProfile: 'YES', googleBusinessProfileUrl: 'https://maps.app.goo.gl/example', companyFax: '',
};
type Payload = Record<string, string | boolean>;
type Reply = { accepted: boolean; bookingUrl: string; checkoutUrl: string };

function setup(options: {
  values?: Map<string, string>;
  reply?: (payload: Payload) => Response | Promise<Response>;
  denyStorage?: boolean;
  denyStorageWrites?: boolean;
  challengeFails?: boolean;
  missingChallenge?: boolean;
} = {}) {
  const values = options.values || new Map<string, string>();
  const request = vi.fn(async (_url: string, init: RequestInit) => {
    const payload = JSON.parse(init.body as string) as Payload;
    if (options.reply) return options.reply(payload);
    return new Response(JSON.stringify({ accepted: true, submissionId: payload.submissionId }), { status: 202 });
  });
  const makeId = vi.fn().mockReturnValueOnce(firstId).mockReturnValue(nextId);
  const scriptRemove = vi.fn();
  const scriptAppend = vi.fn();
  const render = vi.fn((_container: unknown, config: Record<string, unknown>) => {
    const callback = config[options.challengeFails ? 'error-callback' : 'callback'] as (value?: string) => void;
    callback('challenge-token');
    return 1;
  });
  const win: {
    turnstile?: { render: typeof render; remove: ReturnType<typeof vi.fn> };
    trcIntakeTransport?: (answers: Record<string, string>, challenge: unknown) => Promise<Reply>;
  } = { turnstile: { render, remove: vi.fn() } };
  if (options.missingChallenge) delete win.turnstile;
  runInNewContext(source, {
    window: win, fetch: request, URL, TextEncoder, Uint8Array, AbortSignal, setTimeout, clearTimeout,
    crypto: { subtle: options.missingChallenge ? { digest: async () => new Uint8Array(32).buffer } : webcrypto.subtle, randomUUID: makeId },
    sessionStorage: {
      getItem: (key: string) => { if (options.denyStorage) throw Error('denied'); return values.get(key) ?? null; },
      setItem: (key: string, value: string) => { if (options.denyStorage || options.denyStorageWrites) throw Error('denied'); values.set(key, value); },
    },
    document: {
      createElement: () => { if (!options.missingChallenge) throw Error('Unexpected external script load in test'); return { remove: scriptRemove }; },
      head: { append: scriptAppend },
    },
  });
  const send = (answers = input) => win.trcIntakeTransport!(answers, {});
  const payload = (index = 0) => JSON.parse(request.mock.calls[index][1].body as string) as Payload;
  return { send, request, payload, makeId, values, render, scriptRemove, scriptAppend };
}

describe('five-step homepage live intake transport', () => {
  it('retains every business/setup answer in the existing receiver message contract', async () => {
    const test = setup();
    await test.send();
    expect(test.request.mock.calls[0][0]).toBe('https://trc-sales-hub.jamil-3d5.workers.dev/v1/intake');
    expect(test.payload()).toMatchObject({
      firstName: 'Alex', lastName: 'Carter', name: 'Alex Carter', business: 'Oakline Roofing',
      email: 'alex@example.com', phone: '+12025550142', contactPreference: 'whatsapp', whatsappConsent: true,
      hasWebsite: 'YES', websiteUrl: 'https://oakline.example/services', requestedDomain: '',
      submissionId: firstId, turnstileToken: 'challenge-token',
    });
    expect(test.payload().message).toBe([
      'Services offered: Roof repair and installation', 'Areas served: Sacramento and Roseville',
      'Domain ownership: Yes', 'Owned domain: oakline.example', 'Google Maps business listing: Yes',
      'Google Maps listing URL: https://maps.app.goo.gl/example',
    ].join('\n'));
    expect(test.render.mock.calls[0][1]).toMatchObject({ action: 'intake', theme: 'dark' });
  });

  it('does not confuse an owned domain with a requested new domain', async () => {
    const test = setup();
    await test.send({ ...input, hasWebsite: 'NO', websiteUrl: '', ownedDomain: 'already-owned.example' });
    expect(test.payload()).toMatchObject({ hasWebsite: 'NO', websiteUrl: '', requestedDomain: '' });
    expect(test.payload().message).toContain('Owned domain: already-owned.example');
  });

  it('maps unknown website to the accepted empty state and drops hidden setup answers', async () => {
    const test = setup();
    await test.send({ ...input, hasWebsite: 'UNSURE', hasDomain: 'NO', hasGoogleBusinessProfile: 'UNSURE' });
    expect(test.payload()).toMatchObject({ hasWebsite: '', websiteUrl: '', requestedDomain: '' });
    expect(test.payload().message).toContain('Domain ownership: No');
    expect(test.payload().message).toContain('Google Maps business listing: Not sure');
    expect(test.payload().message).not.toContain('Owned domain:');
    expect(test.payload().message).not.toContain('Google Maps listing URL:');
  });

  it('uses email without sending a hidden phone or claiming WhatsApp consent', async () => {
    const test = setup();
    await test.send({ ...input, preferredContact: 'EMAIL' });
    expect(test.payload()).toMatchObject({ contactPreference: 'email', phone: '', whatsappConsent: false });
  });

  it('retries ambiguous requests with the same UUID, including after page reload', async () => {
    const values = new Map<string, string>();
    const uncertain = setup({ values, reply: async () => { throw Error('network interrupted'); } });
    await expect(uncertain.send()).rejects.toThrow('network interrupted');
    await expect(uncertain.send()).rejects.toThrow('network interrupted');
    expect(uncertain.payload(0).submissionId).toBe(firstId);
    expect(uncertain.payload(1).submissionId).toBe(firstId);
    expect(uncertain.makeId).toHaveBeenCalledTimes(1);
    const reloaded = setup({ values });
    await reloaded.send();
    expect(reloaded.payload().submissionId).toBe(firstId);
    expect(reloaded.makeId).not.toHaveBeenCalled();
    const saved = JSON.parse(values.get('trc-intake-retry')!);
    expect(Object.keys(saved).sort()).toEqual(['digest', 'id']);
    expect(JSON.stringify(saved)).not.toContain('alex@example.com');
  });

  it('assigns edited answers a new identity and survives blocked browser storage', async () => {
    const test = setup({ denyStorage: true });
    await test.send();
    await test.send();
    await test.send({ ...input, serviceAreas: 'Austin' });
    expect(test.payload(0).submissionId).toBe(firstId);
    expect(test.payload(1).submissionId).toBe(firstId);
    expect(test.payload(2).submissionId).toBe(nextId);
    expect(test.makeId).toHaveBeenCalledTimes(2);
  });

  it('keeps the new in-memory retry identity when readable storage is stale and writes fail', async () => {
    const values = new Map([['trc-intake-retry', JSON.stringify({ id: nextId, digest: '0'.repeat(64) })]]);
    const test = setup({ values, denyStorageWrites: true, reply: async () => { throw Error('response lost'); } });
    await expect(test.send()).rejects.toThrow('response lost');
    await expect(test.send()).rejects.toThrow('response lost');
    expect(test.payload(0).submissionId).toBe(firstId);
    expect(test.payload(1).submissionId).toBe(firstId);
    expect(test.makeId).toHaveBeenCalledTimes(1);
    expect(JSON.parse(values.get('trc-intake-retry')!).id).toBe(nextId);
  });

  it('bounds a security-script load that never fires load or error', async () => {
    vi.useFakeTimers();
    try {
      const test = setup({ missingChallenge: true });
      let outcome: unknown;
      void test.send().then(() => { outcome = 'unexpected success'; }, error => { outcome = error; });
      // Drain the immediate identity/hash promises before starting the load clock.
      for (let index = 0; index < 12; index++) await Promise.resolve();
      await vi.advanceTimersByTimeAsync(90001);
      expect(outcome).toBeDefined();
      expect(String(outcome)).toMatch(/Security check/);
      expect(test.request).not.toHaveBeenCalled();
      expect(test.scriptRemove).toHaveBeenCalledTimes(1);
      expect(test.scriptAppend).toHaveBeenCalledTimes(1);
      outcome = undefined;
      void test.send().then(() => { outcome = 'unexpected success'; }, error => { outcome = error; });
      for (let index = 0; index < 12; index++) await Promise.resolve();
      await vi.advanceTimersByTimeAsync(15001);
      expect(String(outcome)).toMatch(/Security check/);
      expect(test.scriptAppend).toHaveBeenCalledTimes(2);
      expect(test.scriptRemove).toHaveBeenCalledTimes(2);
    } finally { vi.useRealTimers(); }
  });

  it.each([
    { accepted: false, submissionId: firstId },
    { accepted: true, submissionId: nextId },
    { accepted: true },
  ])('requires exact acceptance before returning booking/payment links: %j', async reply => {
    const test = setup({ reply: async () => new Response(JSON.stringify(reply), { status: 202 }) });
    await expect(test.send()).rejects.toThrow('could not confirm delivery');
  });

  it('rejects HTTP errors even when the body claims acceptance', async () => {
    const test = setup({ reply: async payload => new Response(JSON.stringify({ accepted: true, submissionId: payload.submissionId }), { status: 503 }) });
    await expect(test.send()).rejects.toThrow('could not confirm delivery');
  });

  it('does not send a request when the security challenge fails', async () => {
    const test = setup({ challengeFails: true });
    await expect(test.send()).rejects.toThrow('Security check failed');
    expect(test.request).not.toHaveBeenCalled();
  });

  it('returns only the existing HTTPS booking and Stripe routes with the accepted inquiry reference', async () => {
    const test = setup({ reply: async payload => new Response(JSON.stringify({ accepted: true, submissionId: payload.submissionId, checkoutUrl: 'javascript:alert(1)', bookingUrl: 'https://evil.example' }), { status: 202 }) });
    const result = await test.send();
    const booking = new URL(result.bookingUrl);
    const checkout = new URL(result.checkoutUrl);
    expect(booking.origin + booking.pathname).toBe('https://calendly.com/thereadyconsult/30min');
    expect(checkout.origin + checkout.pathname).toBe('https://buy.stripe.com/cNi4gyfXj3o9dnxdK75EY0o');
    expect(booking.searchParams.get('utm_content')).toBe(firstId);
    expect(checkout.searchParams.get('client_reference_id')).toBe(firstId);
    expect(booking.searchParams.get('email')).toBe('alex@example.com');
    expect(checkout.searchParams.get('prefilled_email')).toBe('alex@example.com');
  });

  it('rejects unsafe website URLs and oversized combined details without sending', async () => {
    const test = setup();
    for (const websiteUrl of ['javascript:alert(1)', 'https://user:password@oakline.example', 'ftp://oakline.example']) {
      await expect(test.send({ ...input, websiteUrl })).rejects.toThrow();
    }
    await expect(test.send({ ...input, servicesOffered: 'x'.repeat(4000) })).rejects.toThrow('shorten');
    expect(test.request).not.toHaveBeenCalled();
  });

  // Set this path when checking against the installed receiver checkout. CI still
  // runs all portable adapter assertions above without requiring a second repo.
  it.skipIf(!process.env.TRC_INTAKE_RECEIVER_MODULE)('is accepted by the actual installed receiver validator', async () => {
    const receiver = await import(/* @vite-ignore */ pathToFileURL(process.env.TRC_INTAKE_RECEIVER_MODULE!).href);
    for (const change of [{}, { hasWebsite: 'UNSURE' }, { preferredContact: 'EMAIL' }]) {
      const test = setup();
      await test.send({ ...input, ...change });
      const accepted = receiver.validateIntake(test.payload());
      expect(accepted.message).toBe(test.payload().message);
      expect(accepted.email).toBe('alex@example.com');
    }
  });
});
