import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('public/assets/intake-calendly.js', 'utf8');
const id = 'c71468b1-f325-43da-b5b8-78aa4a53d940';
const url = `https://calendly.com/thereadyconsult/30min?utm_content=${id}`;
const answers = {
  firstName: 'Alex', lastName: 'Carter', email: 'alex@example.com', businessName: 'Oakline Roofing',
  servicesOffered: 'Roof repair\nRoof replacement', serviceAreas: 'Sacramento and Roseville',
  hasWebsite: 'YES', websiteUrl: 'https://oakline.example', hasDomain: 'YES', ownedDomain: 'oakline.example',
  hasGoogleBusinessProfile: 'UNSURE', preferredContact: 'WHATSAPP', phone: '+12025550142',
};
type BookingDetails = { url: string; prefill: { name: string; email: string; customAnswers: { a1: string } }; utm: { utmContent: string }; fallbackUrl: string };
type Api = { details: (answers: Record<string, string>, url: string) => BookingDetails; mount: (parent: object, answers: Record<string, string>, url: string, callback: () => void) => Promise<void>; cleanup: () => void };

function setup() {
  const listeners: { callback?: (event: unknown) => void; signal?: AbortSignal } = {};
  const iframe = { contentWindow: {}, title: '' };
  const parent = { isConnected: true, replaceChildren: vi.fn(), addEventListener: vi.fn(), querySelector: vi.fn(() => iframe) };
  const initInlineWidget = vi.fn();
  const window = {
    trcCalendly: undefined as Api | undefined, Calendly: { initInlineWidget },
    addEventListener: (_type: string, callback: (event: unknown) => void, options: { signal: AbortSignal }) => { listeners.callback = callback; listeners.signal = options.signal; },
  };
  runInNewContext(source, { window, URL, AbortController, setTimeout, clearTimeout });
  return { api: window.trcCalendly!, initInlineWidget, parent, iframe, listeners };
}

describe('Calendly intake handoff', () => {
  it('prefills every business answer and retains the accepted submission reference', () => {
    const details = setup().api.details(answers, url);
    expect(details.prefill.name).toBe('Alex Carter');
    expect(details.prefill.email).toBe('alex@example.com');
    for (const text of ['Business: Oakline Roofing', 'Services: Roof repair\nRoof replacement', 'Areas served: Sacramento and Roseville', 'Already has a website: Yes', 'Website: https://oakline.example', 'Owns a website domain: Yes', 'Owned domain: oakline.example', 'Google Business listing: Not sure', 'Preferred contact: WhatsApp', 'WhatsApp: +12025550142']) expect(details.prefill.customAnswers.a1).toContain(text);
    expect(details.utm.utmContent).toBe(id);
    const fallback = new URL(details.fallbackUrl);
    expect(fallback.searchParams.get('a1')).toBe(details.prefill.customAnswers.a1);
    expect(fallback.searchParams.get('utm_content')).toBe(id);
  });

  it('does not expose hidden phone or stale website/domain answers', () => {
    const details = setup().api.details({ ...answers, preferredContact: 'EMAIL', hasWebsite: 'NO', hasDomain: 'NO', hasGoogleBusinessProfile: 'YES' }, url);
    expect(details.prefill.customAnswers.a1).toContain('Preferred contact: Email');
    expect(details.prefill.customAnswers.a1).toContain('Google Business listing: Yes');
    expect(details.prefill.customAnswers.a1).not.toContain('+12025550142');
    expect(details.prefill.customAnswers.a1).not.toContain('https://oakline.example');
    expect(details.prefill.customAnswers.a1).not.toContain('Owned domain:');
  });

  it('sends name and summary through prefill instead of conflicting URL copies', () => {
    const details = setup().api.details(answers, `${url}&name=Old+Name&email=old%40example.com&a1=old`);
    const embedded = new URL(details.url);
    expect(embedded.searchParams.has('name')).toBe(false);
    expect(embedded.searchParams.has('email')).toBe(false);
    expect(embedded.searchParams.has('a1')).toBe(false);
    expect(details.prefill.name).toBe('Alex Carter');
    expect(new URL(details.fallbackUrl).searchParams.get('name')).toBe('Alex Carter');
  });

  it.each(['https://evil.example/thereadyconsult/30min', 'http://calendly.com/thereadyconsult/30min', 'https://user:pass@calendly.com/thereadyconsult/30min', 'https://calendly.com/other/30min', 'https://calendly.com/thereadyconsult/30min'])('rejects unsafe or unlinked booking destination %s', candidate => {
    expect(() => setup().api.details(answers, candidate)).toThrow();
  });

  it('loads the embed with the prefill and ignores forged booking messages', async () => {
    const test = setup(), scheduled = vi.fn();
    await test.api.mount(test.parent, answers, url, scheduled);
    expect(test.initInlineWidget).toHaveBeenCalledWith(expect.objectContaining({ parentElement: test.parent, prefill: expect.objectContaining({ email: 'alex@example.com' }), utm: { utmContent: id } }));
    const data = { event: 'calendly.event_scheduled', payload: { event: { uri: `https://api.calendly.com/scheduled_events/${id}` } } };
    test.listeners.callback!({ origin: 'https://evil.example', source: test.iframe.contentWindow, data });
    test.listeners.callback!({ origin: 'https://calendly.com', source: {}, data });
    test.listeners.callback!({ origin: 'https://calendly.com', source: test.iframe.contentWindow, data: { ...data, payload: {} } });
    expect(scheduled).not.toHaveBeenCalled();
    test.listeners.callback!({ origin: 'https://calendly.com', source: test.iframe.contentWindow, data });
    expect(scheduled).toHaveBeenCalledTimes(1);
    test.api.cleanup();
    expect(test.listeners.signal!.aborted).toBe(true);
    expect(test.parent.replaceChildren).toHaveBeenCalled();
  });
});
