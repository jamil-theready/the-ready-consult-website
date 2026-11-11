(() => {
  const shell = document.querySelector('.cta-form-shell');
  const panel = document.querySelector('.bottom-cta-panel');
  const options = document.querySelector('.signup-flow-card');
  if (!shell || !panel || !options) return;

  const oldForm = shell.querySelector('#signup-form');
  shell.querySelector('#signup-title')?.remove();
  shell.querySelector('.signup-intro')?.remove();
  shell.querySelector('.cta-form-close').hidden = true;
  oldForm.outerHTML = `
    <form id="intake-form" class="signup-form intake-flow" novalidate>
      <div class="intake-top"><button type="button" class="intake-back">← Back</button><div class="intake-progress" aria-label="Step 1 of 4"><span class="intake-count">01 / 04</span><span class="intake-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div></div>
      <h2 class="intake-heading">Tell us about your business.</h2>
      <div class="intake-body">
        <section class="intake-step intake-fields" data-step="1">
          <label>First name<input name="firstName" autocomplete="given-name" maxlength="79" required></label>
          <label>Last name<input name="lastName" autocomplete="family-name" maxlength="80" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" maxlength="200" required></label>
          <label>Business name<input name="businessName" autocomplete="organization" maxlength="200" required></label>
        </section>
        <section class="intake-step" data-step="2" hidden>
          <fieldset class="intake-channel"><legend class="visually-hidden">Preferred contact method</legend>
            <label class="channel-option selected"><input type="radio" name="preferredContact" value="WHATSAPP" checked><span class="channel-icon"><img src="/assets/whatsapp-icon.svg" alt=""></span><span><strong>WhatsApp</strong><small>Message me on WhatsApp</small></span></label>
            <label class="channel-option"><input type="radio" name="preferredContact" value="EMAIL"><span class="channel-icon"><img src="/assets/gmail-icon.svg" alt=""></span><span><strong>Email</strong><small>Send me an email</small></span></label>
          </fieldset>
          <div class="intake-phone"><label>Your WhatsApp number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+1 202 555 0142" maxlength="40" required></label><p>Include your country code. We check the number format before messaging you.</p></div>
        </section>
        <section class="intake-step" data-step="3" hidden>
          <fieldset class="intake-website"><legend class="visually-hidden">Do you already have a website?</legend>
            <label class="website-pill"><input type="radio" name="hasWebsite" value="YES">Yes</label>
            <label class="website-pill selected"><input type="radio" name="hasWebsite" value="NO" checked>No</label>
            <label class="website-pill"><input type="radio" name="hasWebsite" value="">Not sure yet</label>
          </fieldset>
          <div class="intake-domain"><label>What domain would you like? <span>(optional)</span><input name="requestedDomain" placeholder="yourbusiness.com" maxlength="253"></label><p>Not sure yet? Leave this blank. We’ll check availability and suggest options when we follow up.</p></div>
          <div class="intake-url" hidden><label>What’s your website address? <span>(optional)</span><input name="websiteUrl" placeholder="yourbusiness.com" maxlength="500" autocomplete="url" disabled></label></div>
        </section>
        <section class="intake-step" data-step="4" hidden>
          <label class="visually-hidden" for="intake-message">Tell us more about your business (optional)</label><textarea id="intake-message" name="message" maxlength="4000" rows="4" placeholder="For example: residential roof repairs and new roof installations in Austin, Round Rock, and Cedar Park."></textarea>
          <p class="intake-note">Submitting sends an inquiry, not a charge. On the next screen, you can book a call or choose secure checkout.</p>
        </section>
        <label class="intake-trap" aria-hidden="true">Leave this blank<input name="companyFax" tabindex="-1" autocomplete="off"></label>
      </div>
      <p class="intake-error" role="alert" hidden></p>
      <div class="intake-actions"><button class="intake-next" type="button">Next</button><button class="intake-submit" type="submit" hidden>Continue to your options</button></div>
    </form>`;

  const form = shell.querySelector('#intake-form');
  const headings = ['Tell us about your business.', 'How should we reach you?', 'Do you already have a website?', 'Tell us more about your business.'];
  const error = form.querySelector('.intake-error');
  const next = form.querySelector('.intake-next');
  const submit = form.querySelector('.intake-submit');
  const phone = form.elements.phone;
  let step = 1;
  let sending = false;
  let submissionId = '';
  let submissionFingerprint = '';

  function showError(message, field) {
    error.textContent = message;
    error.hidden = false;
    field?.focus();
  }
  function clearError() { error.hidden = true; error.textContent = ''; }
  function showStep(number) {
    step = Math.min(4, Math.max(1, number));
    clearError();
    form.querySelector('.intake-heading').textContent = headings[step - 1];
    form.querySelectorAll('.intake-step').forEach(section => { section.hidden = Number(section.dataset.step) !== step; });
    form.querySelector('.intake-progress').setAttribute('aria-label', `Step ${step} of 4`);
    form.querySelector('.intake-count').textContent = `${String(step).padStart(2, '0')} / 04`;
    form.querySelectorAll('.intake-bars i').forEach((bar, index) => bar.classList.toggle('active', index < step));
    next.hidden = step === 4;
    submit.hidden = step !== 4;
  }
  function currentValid() {
    const section = form.querySelector(`[data-step="${step}"]`);
    for (const input of section.querySelectorAll('input[required]:not(:disabled)')) {
      if (!input.reportValidity()) return false;
    }
    if (step === 2 && form.elements.preferredContact.value === 'WHATSAPP' && !/^\+[1-9]\d{7,14}$/.test(phone.value.replace(/[ ().-]/g, ''))) {
      showError('Enter your WhatsApp number with country code, for example +1 202 555 0142.', phone);
      return false;
    }
    return true;
  }
  function markComplete(input) {
    if (input.type === 'radio') return;
    input.classList.toggle('is-complete', input.value.trim() !== '' && input.checkValidity());
  }
  form.addEventListener('input', event => { if (event.target.matches('input, textarea')) { markComplete(event.target); clearError(); } });
  form.querySelector('.intake-back').addEventListener('click', () => {
    if (step === 1) shell.querySelector('.cta-form-close').click();
    else showStep(step - 1);
  });
  next.addEventListener('click', () => { if (currentValid()) showStep(step + 1); });
  form.querySelectorAll('input[name="preferredContact"]').forEach(radio => radio.addEventListener('change', () => {
    form.querySelectorAll('.channel-option').forEach(label => label.classList.toggle('selected', label.querySelector('input').checked));
    const usePhone = form.elements.preferredContact.value === 'WHATSAPP';
    form.querySelector('.intake-phone').hidden = !usePhone;
    phone.disabled = !usePhone;
    phone.required = usePhone;
    clearError();
  }));
  form.querySelectorAll('input[name="hasWebsite"]').forEach(radio => radio.addEventListener('change', () => {
    form.querySelectorAll('.website-pill').forEach(label => label.classList.toggle('selected', label.querySelector('input').checked));
    const value = form.elements.hasWebsite.value;
    const url = form.querySelector('.intake-url');
    const domain = form.querySelector('.intake-domain');
    url.hidden = value !== 'YES';
    domain.hidden = value === 'YES' || value === '';
    form.elements.websiteUrl.disabled = value !== 'YES';
    form.elements.requestedDomain.disabled = value === 'YES' || value === '';
    clearError();
  }));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (step !== 4 || sending) return;
    if (form.elements.companyFax.value) { showError('Please email us directly to continue.'); return; }
    const data = Object.fromEntries(new FormData(form));
    const firstName = String(data.firstName || '').trim();
    const lastName = String(data.lastName || '').trim();
    const businessName = String(data.businessName || '').trim();
    const email = String(data.email || '').trim().toLowerCase();
    const preferredContact = String(data.preferredContact || 'WHATSAPP');
    const number = String(data.phone || '').replace(/[ ().-]/g, '');
    const hasWebsite = String(data.hasWebsite || '');
    let websiteUrl = '', requestedDomain = '';
    if (hasWebsite === 'YES' && data.websiteUrl?.trim()) {
      try {
        const url = new URL(data.websiteUrl.includes('://') ? data.websiteUrl : `https://${data.websiteUrl}`);
        if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw Error();
        websiteUrl = url.href;
      } catch { showStep(3); showError('Enter a website address such as yourbusiness.com.', form.elements.websiteUrl); return; }
    }
    if (hasWebsite !== 'YES') {
      requestedDomain = String(data.requestedDomain || '').trim().toLowerCase();
      if (requestedDomain && !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(requestedDomain)) {
        showStep(3); showError('Enter a domain like yourbusiness.com, or leave it blank.', form.elements.requestedDomain); return;
      }
    }
    const lead = {firstName, lastName, businessName, email, phone: number, preferredContact, hasWebsite, websiteUrl, requestedDomain, message: String(data.message || '').trim(), companyFax: '', reviewReasons: []};
    const fingerprint = JSON.stringify(lead);
    if (fingerprint !== submissionFingerprint) { submissionFingerprint = fingerprint; submissionId = crypto.randomUUID(); }
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    clearError();
    try {
      const response = await fetch('https://api.web3forms.com/submit', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify({access_key: 'ceeca694-d4b0-4e82-ba31-26508257f8d6', from_name: 'The Ready Consult', name: `${firstName} ${lastName}`, email, business: businessName, phone: number, contact_via: preferredContact, website: websiteUrl, requested_domain: requestedDomain, message: lead.message, subject: `TRC website inquiry — ${submissionId}`, trc_intake: JSON.stringify({version: 1, submissionId, lead})}), signal: AbortSignal.timeout(20000)});
      const result = await response.json();
      if (!response.ok || result.success !== true) throw Error('Delivery was not confirmed.');
      const checkout = new URL('https://buy.stripe.com/cNi4gyfXj3o9dnxdK75EY0o');
      checkout.searchParams.set('prefilled_email', email);
      checkout.searchParams.set('client_reference_id', submissionId);
      options.querySelector('.checkout-link').href = checkout.href;
      shell.hidden = true;
      options.hidden = false;
      options.querySelector('h2').focus();
      panel.scrollIntoView({behavior: 'smooth', block: 'start'});
    } catch {
      showError('We could not confirm delivery. Please try again; your details are still here.');
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = 'Continue to your options';
    }
  });
  showStep(1);
})();
