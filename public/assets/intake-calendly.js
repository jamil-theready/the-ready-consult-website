// Calendly receives only the answers from this accepted intake, in this browser.
(() => {
  window.trcCalendly?.cleanup();
  let active;
  const states = { YES: 'Yes', NO: 'No', UNSURE: 'Not sure' };
  const text = (answers, key) => String(answers[key] || '').trim();

  function details(answers, bookingUrl) {
    const url = new URL(bookingUrl);
    if (url.origin !== 'https://calendly.com' || url.pathname !== '/thereadyconsult/30min' || url.username || url.password) throw Error('Booking link is unavailable.');
    const submissionId = url.searchParams.get('utm_content');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId || '')) throw Error('Please complete your details before booking.');
    const whatsapp = answers.preferredContact === 'WHATSAPP';
    const summary = [
      `Business: ${text(answers, 'businessName')}`,
      `Services: ${text(answers, 'servicesOffered')}`,
      `Areas served: ${text(answers, 'serviceAreas')}`,
      `Already has a website: ${states[answers.hasWebsite] || 'Not sure'}`,
      answers.hasWebsite === 'YES' && text(answers, 'websiteUrl') ? `Website: ${text(answers, 'websiteUrl')}` : '',
      `Owns a website domain: ${states[answers.hasDomain] || 'Not sure'}`,
      answers.hasDomain === 'YES' && text(answers, 'ownedDomain') ? `Owned domain: ${text(answers, 'ownedDomain')}` : '',
      `Google Business listing: ${states[answers.hasGoogleBusinessProfile] || 'Not sure'}`,
      `Preferred contact: ${whatsapp ? 'WhatsApp' : 'Email'}`,
      whatsapp ? `WhatsApp: ${text(answers, 'phone')}` : '',
    ].filter(Boolean).join('\n');
    if (summary.length > 10000) throw Error('Your business details are too long for the booking form.');
    const prefill = {
      name: [text(answers, 'firstName'), text(answers, 'lastName')].filter(Boolean).join(' '),
      email: text(answers, 'email'),
      // Public form verified: its first custom question is the meeting-preparation textarea.
      customAnswers: { a1: summary },
    };
    const fallback = new URL(url);
    fallback.searchParams.set('name', prefill.name);
    fallback.searchParams.set('email', prefill.email);
    fallback.searchParams.set('a1', summary);
    // The embed SDK delivers prefill by postMessage. Remove its older URL copies
    // so query parsing cannot override the full name (spaces becoming pluses).
    ['name', 'email', 'a1'].forEach(key => url.searchParams.delete(key));
    url.searchParams.set('hide_event_type_details', '1');
    url.searchParams.set('background_color', '191b1e');
    url.searchParams.set('text_color', 'f5f6f8');
    url.searchParams.set('primary_color', 'e9a63c');
    return { url: url.href, prefill, utm: { utmContent: submissionId }, fallbackUrl: fallback.href };
  }

  async function loadLibrary() {
    if (window.Calendly?.initInlineWidget) return;
    window.trcCalendlyLibraryPromise ??= new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => { clearTimeout(timeout); script.remove(); window.trcCalendlyLibraryPromise = null; reject(Error('The calendar could not load. Use the booking link below.')); };
      const timeout = setTimeout(fail, 12000);
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => { if (!window.Calendly?.initInlineWidget) { fail(); return; } clearTimeout(timeout); resolve(); };
      script.onerror = fail;
      document.head.append(script);
    });
    await window.trcCalendlyLibraryPromise;
  }

  function cleanup() {
    if (!active) return;
    active.abort.abort();
    active.parent.replaceChildren();
    active = null;
  }

  async function mount(parent, answers, bookingUrl, onScheduled) {
    const config = details(answers, bookingUrl);
    cleanup();
    const session = { parent, abort: new AbortController() };
    active = session;
    await loadLibrary();
    if (active !== session || !parent.isConnected) return;
    const iframeLoaded = event => {
      if (event.target.tagName === 'IFRAME') parent.closest('.signup-booking').querySelector('.booking-status').hidden = true;
    };
    parent.addEventListener('load', iframeLoaded, { capture: true, signal: session.abort.signal });
    window.addEventListener('message', event => {
      const frame = parent.querySelector('iframe');
      if (event.origin !== 'https://calendly.com' || !frame || event.source !== frame.contentWindow || event.data?.event !== 'calendly.event_scheduled') return;
      const appointment = event.data.payload?.event?.uri;
      if (typeof appointment !== 'string' || !/^https:\/\/api\.calendly\.com\/scheduled_events\/[0-9a-f-]{36}$/i.test(appointment)) return;
      // This updates presentation only. The signed webhook remains the CRM booking authority.
      onScheduled?.();
    }, { signal: session.abort.signal });
    window.Calendly.initInlineWidget({ url: config.url, parentElement: parent, prefill: config.prefill, utm: config.utm, resize: false });
    const frame = parent.querySelector('iframe');
    if (frame) frame.title = 'Choose a time for your website consultation';
  }

  window.trcCalendly = { details, mount, cleanup };
})();
