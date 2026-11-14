// Uses the existing receiver contract so all setup answers reach CRM intake details.
(() => {
  const endpoint = 'https://trc-sales-hub.jamil-3d5.workers.dev/v1/intake';
  let challengeScript;
  let challengeWidget;
  let previousIdentity;
  function buildPayload(answers) {
    const text = key => String(answers[key] || '').trim();
    const states = { YES: 'Yes', NO: 'No', UNSURE: 'Not sure' };
    const message = [
      `Services offered: ${text('servicesOffered')}`,
      `Areas served: ${text('serviceAreas')}`,
      `Domain ownership: ${states[text('hasDomain')] || 'Not sure'}`,
      answers.hasDomain === 'YES' && text('ownedDomain') ? `Owned domain: ${text('ownedDomain')}` : '',
      `Google Business listing: ${states[text('hasGoogleBusinessProfile')] || 'Not sure'}`,
      ['CALL', 'SUBSCRIBE'].includes(answers.signupIntent) ? `Requested next step: ${answers.signupIntent === 'CALL' ? 'Book a consultation' : 'Start subscription'}` : '',
    ].filter(Boolean).join('\n');
    if (message.length > 4000) throw Error('Please shorten your business details slightly.');
    let websiteUrl = '';
    if (answers.hasWebsite === 'YES' && text('websiteUrl')) {
      const raw = text('websiteUrl');
      const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
      if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw Error('Please check your website address.');
      websiteUrl = url.href;
    }
    const contactPreference = answers.preferredContact === 'EMAIL' ? 'email' : 'whatsapp';
    return {
      firstName: text('firstName'), lastName: text('lastName'), name: `${text('firstName')} ${text('lastName')}`,
      email: text('email').toLowerCase(), business: text('businessName'),
      phone: contactPreference === 'whatsapp' ? text('phone').replace(/[ ().-]/g, '') : '',
      contactPreference, whatsappConsent: contactPreference === 'whatsapp',
      hasWebsite: ['YES', 'NO'].includes(answers.hasWebsite) ? answers.hasWebsite : '', websiteUrl,
      // Ownership is distinct from a request to register a new domain.
      requestedDomain: '', message, companyFax: text('companyFax'),
    };
  }
  async function identityFor(payload) {
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const digest = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
    const matches = identity => identity?.digest === digest && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identity.id);
    if (matches(previousIdentity)) return previousIdentity.id;
    let previous;
    try { previous = JSON.parse(sessionStorage.getItem('trc-intake-retry') || 'null'); } catch { /* Private browsing may deny storage. */ }
    if (matches(previous)) { previousIdentity = previous; return previous.id; }
    const identity = { id: crypto.randomUUID(), digest };
    previousIdentity = identity;
    try { sessionStorage.setItem('trc-intake-retry', JSON.stringify(identity)); } catch { /* Keep the in-memory retry identity. */ }
    return identity.id;
  }
  async function securityToken(container) {
    if (!window.turnstile) {
      challengeScript ??= new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const fail = () => {
          clearTimeout(timeout);
          script.remove();
          challengeScript = null;
          reject(Error('Security check unavailable. Please try again.'));
        };
        const timeout = setTimeout(fail, 15000);
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = () => { clearTimeout(timeout); resolve(); };
        script.onerror = fail;
        document.head.append(script);
      });
      await challengeScript;
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(Error('Security check timed out. Please try again.')), 90000);
      const complete = callback => value => { clearTimeout(timeout); callback(value); };
      if (challengeWidget !== undefined) window.turnstile.remove(challengeWidget);
      challengeWidget = window.turnstile.render(container, {
        sitekey: '0x4AAAAAAF7X5L8R8oIPdQvo', action: 'intake', theme: 'dark',
        appearance: 'interaction-only', 'response-field': false,
        'before-interactive-callback': () => container.scrollIntoView({ block: 'nearest', behavior: 'instant' }),
        callback: complete(resolve), 'error-callback': complete(() => reject(Error('Security check failed. Please try again.'))),
        'expired-callback': complete(() => reject(Error('Security check expired. Please try again.'))),
      });
    });
  }
  window.trcIntakeTransport = async (answers, challenge) => {
    const payload = buildPayload(answers);
    const submissionId = await identityFor(payload);
    const turnstileToken = await securityToken(challenge);
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, submissionId, turnstileToken }), signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok || result.accepted !== true || result.submissionId !== submissionId) throw Error('We could not confirm delivery. Please try again; your details are still here.');
    const booking = new URL('https://calendly.com/thereadyconsult/30min');
    booking.searchParams.set('name', payload.name);
    booking.searchParams.set('email', payload.email);
    booking.searchParams.set('utm_content', submissionId);
    // Preserve the existing payment link; payment automation remains separate.
    const checkout = new URL('https://buy.stripe.com/cNi4gyfXj3o9dnxdK75EY0o');
    checkout.searchParams.set('prefilled_email', payload.email);
    checkout.searchParams.set('client_reference_id', submissionId);
    return { accepted: true, bookingUrl: booking.href, checkoutUrl: checkout.href };
  };
})();
