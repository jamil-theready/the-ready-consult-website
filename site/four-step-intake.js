// Shared form controller. Live transport is mounted separately, never in previews.
(() => {
  const dialog = document.querySelector('#four-intake-dialog');
  const shell = dialog?.querySelector('.cta-form-shell');
  const options = dialog?.querySelector('.signup-flow-card');
  if (!shell || !options) return;
  const live = dialog.dataset.intakeMode === 'live';

  const choices = (name, selected = 'UNSURE') => ['YES', 'NO', 'UNSURE'].map(value => `
    <label class="website-pill${value === selected ? ' selected' : ''}">
      <input type="radio" name="${name}" value="${value}"${value === selected ? ' checked' : ''}>
      ${value === 'YES' ? 'Yes' : value === 'NO' ? 'No' : 'Not sure'}
    </label>`).join('');

  shell.querySelector('.cta-form-close').hidden = true;
  shell.querySelector('#signup-form').outerHTML = `
    <form id="intake-form" class="signup-form intake-flow" novalidate>
      <div class="intake-top">
        <button type="button" class="intake-back">← Back</button>
        <div class="intake-progress" aria-label="Step 1 of 4">
          <span class="intake-count">01 / 04</span>
          <span class="intake-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
      </div>
      <h2 class="intake-heading" tabindex="-1">Your details.</h2>
      <div class="intake-body" tabindex="0" role="region" aria-label="Your details">
        <section class="intake-step intake-fields" data-step="1">
          <label>First name<input name="firstName" autocomplete="given-name" maxlength="79" required></label>
          <label>Last name<input name="lastName" autocomplete="family-name" maxlength="80" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" maxlength="200" required></label>
          <label>Business name<input name="businessName" autocomplete="organization" maxlength="200" required></label>
        </section>
        <section class="intake-step intake-business-fields" data-step="2" hidden>
          <label>What services do you offer?<textarea name="servicesOffered" rows="3" maxlength="1500" placeholder="For example: roof repairs, reroofing, and new roof installations." required></textarea></label>
          <label>What areas do you serve?<input name="serviceAreas" maxlength="500" placeholder="For example: Sacramento, Roseville, and Elk Grove." required></label>
        </section>
        <section class="intake-step intake-setup" data-step="3" hidden>
          <div class="intake-setup-question">
            <fieldset class="intake-question"><legend>Do you already have a website?</legend><div class="intake-pills">${choices('hasWebsite', 'NO')}</div></fieldset>
            <div class="intake-url intake-followup" hidden><label>Your website address <span>(optional)</span><input name="websiteUrl" autocomplete="url" placeholder="yourbusiness.com" maxlength="500" disabled></label></div>
          </div>
          <div class="intake-setup-question">
            <fieldset class="intake-question"><legend>Do you own a domain?</legend><div class="intake-pills">${choices('hasDomain')}</div></fieldset>
            <div class="intake-owned-domain intake-followup" hidden><label>Your domain <span>(optional)</span><input name="ownedDomain" autocomplete="url" placeholder="yourbusiness.com" maxlength="253" disabled></label></div>
            <p class="intake-domain-summary" hidden></p>
          </div>
          <div class="intake-setup-question">
            <fieldset class="intake-question"><legend>Do you have a Google Maps business listing?</legend><div class="intake-pills">${choices('hasGoogleBusinessProfile')}</div></fieldset>
            <div class="intake-google-url intake-followup" hidden><label>Your Google Maps listing link <span>(optional)</span><input name="googleBusinessProfileUrl" autocomplete="url" placeholder="Paste your listing link, if you have it." maxlength="1000" disabled></label></div>
          </div>
        </section>
        <section class="intake-step" data-step="4" hidden>
          <fieldset class="intake-channel"><legend class="visually-hidden">Preferred contact method</legend>
            <label class="channel-option selected"><input type="radio" name="preferredContact" value="WHATSAPP" checked><span class="channel-icon"><img src="/assets/whatsapp-icon.svg" alt=""></span><span><span class="channel-title">WhatsApp</span><small>Message me on WhatsApp</small></span></label>
            <label class="channel-option"><input type="radio" name="preferredContact" value="EMAIL"><span class="channel-icon"><img src="/assets/gmail-icon.svg" alt=""></span><span><span class="channel-title">Email</span><small>Send me an email</small></span></label>
          </fieldset>
          <div class="intake-phone"><label>Your WhatsApp number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+1 202 555 0142" maxlength="40" required></label><p>Include your country code. We check the number format before messaging you.</p></div>
          <p class="intake-contact-email" hidden></p>
          <div class="intake-challenge" aria-label="Form security check"></div>
        </section>
        <label class="intake-trap" aria-hidden="true">Leave this blank<input name="companyFax" tabindex="-1" autocomplete="off"></label>
      </div>
      <div class="intake-feedback"><span class="intake-scroll-hint" hidden>More below ↓</span><p class="intake-error" role="alert" hidden></p></div>
      <div class="intake-actions"><button class="intake-next" type="button">Next</button><button class="intake-submit" type="submit" hidden>Continue</button></div>
    </form>`;

  const form = shell.querySelector('#intake-form');
  const body = form.querySelector('.intake-body');
  const heading = form.querySelector('.intake-heading');
  const next = form.querySelector('.intake-next');
  const submit = form.querySelector('.intake-submit');
  const error = form.querySelector('.intake-error');
  const scrollHint = form.querySelector('.intake-scroll-hint');
  const headings = ['Your details.', 'Your business.', 'What do you already have?', 'How should we reach you?'];
  let step = 1;
  let sending = false;

  function updateScrollHint() { scrollHint.hidden = !error.hidden || body.scrollHeight - body.scrollTop - body.clientHeight < 8; }
  function clearError() { error.hidden = true; error.textContent = ''; updateScrollHint(); }
  function showError(message, field) {
    error.textContent = message;
    error.hidden = false;
    scrollHint.hidden = true;
    field?.focus({ preventScroll: true });
    field?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
  function websiteDomain() {
    if (form.elements.hasWebsite.value !== 'YES') return '';
    const value = form.elements.websiteUrl.value.trim();
    if (!value) return '';
    try {
      const url = new URL(value.includes('://') ? value : `https://${value}`);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) return '';
      return url.hostname.replace(/^www\./, '');
    } catch { return ''; }
  }
  function syncSetup() {
    const website = form.elements.hasWebsite.value === 'YES';
    form.querySelector('.intake-url').hidden = !website;
    form.elements.websiteUrl.disabled = !website;
    const ownsDomain = form.elements.hasDomain.value === 'YES';
    const reusedDomain = ownsDomain ? websiteDomain() : '';
    form.querySelector('.intake-owned-domain').hidden = !ownsDomain || !!reusedDomain;
    form.elements.ownedDomain.disabled = !ownsDomain || !!reusedDomain;
    const summary = form.querySelector('.intake-domain-summary');
    summary.hidden = !reusedDomain;
    summary.textContent = reusedDomain ? `Domain: ${reusedDomain} · from your website address` : '';
    const google = form.elements.hasGoogleBusinessProfile.value === 'YES';
    form.querySelector('.intake-google-url').hidden = !google;
    form.elements.googleBusinessProfileUrl.disabled = !google;
    requestAnimationFrame(updateScrollHint);
  }
  function syncContact() {
    const whatsapp = form.elements.preferredContact.value === 'WHATSAPP';
    form.querySelector('.intake-phone').hidden = !whatsapp;
    form.elements.phone.disabled = !whatsapp;
    form.elements.phone.required = whatsapp;
    const email = form.querySelector('.intake-contact-email');
    email.hidden = whatsapp;
    email.textContent = `We’ll email you at ${form.elements.email.value.trim()}.`;
    requestAnimationFrame(updateScrollHint);
  }
  function showStep(number, focus = true) {
    step = Math.max(1, Math.min(4, number));
    clearError();
    heading.textContent = headings[step - 1];
    body.setAttribute('aria-label', headings[step - 1]);
    form.querySelectorAll('.intake-step').forEach(section => { section.hidden = Number(section.dataset.step) !== step; });
    form.querySelector('.intake-count').textContent = `${String(step).padStart(2, '0')} / 04`;
    form.querySelector('.intake-progress').setAttribute('aria-label', `Step ${step} of 4`);
    form.querySelectorAll('.intake-bars i').forEach((bar, index) => bar.classList.toggle('active', index < step));
    next.hidden = step === 4;
    submit.hidden = step !== 4;
    syncSetup();
    syncContact();
    body.scrollTop = 0;
    if (focus) heading.focus({ preventScroll: true });
  }
  function currentValid() {
    const section = form.querySelector(`[data-step="${step}"]`);
    for (const field of section.querySelectorAll('input:not(:disabled), textarea:not(:disabled)')) {
      if (field.type === 'radio') continue;
      if ((field.required && !field.value.trim()) || !field.checkValidity()) {
        showError(field.validity.typeMismatch ? 'Enter a valid email address.' : 'Please complete this field.', field);
        return false;
      }
    }
    if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim())) {
      showError('Enter a valid email address.', form.elements.email); return false;
    }
    if (step === 3) {
      if (form.elements.hasWebsite.value === 'YES' && form.elements.websiteUrl.value.trim() && !websiteDomain()) {
        showError('Enter a website address such as yourbusiness.com.', form.elements.websiteUrl); return false;
      }
      const domain = form.elements.ownedDomain;
      if (!domain.disabled && domain.value.trim() && !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain.value.trim())) {
        showError('Enter a domain such as yourbusiness.com, or leave it blank.', domain); return false;
      }
      const listing = form.elements.googleBusinessProfileUrl;
      if (!listing.disabled && listing.value.trim()) {
        try {
          const url = new URL(listing.value.includes('://') ? listing.value : `https://${listing.value}`);
          if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw Error();
        } catch { showError('Enter a full listing link, or leave it blank.', listing); return false; }
      }
    }
    if (step === 4 && form.elements.preferredContact.value === 'WHATSAPP' && !/^\+[1-9]\d{7,14}$/.test(form.elements.phone.value.replace(/[ ().-]/g, ''))) {
      showError('Include your country code, for example +1 202 555 0142.', form.elements.phone); return false;
    }
    return true;
  }
  form.addEventListener('input', event => {
    const field = event.target;
    if (!field.matches('input:not([type=radio]), textarea')) return;
    field.classList.toggle('is-complete', !!field.value.trim() && field.checkValidity());
    if (field.name === 'websiteUrl') syncSetup();
    clearError();
  });
  body.addEventListener('scroll', updateScrollHint, { passive: true });
  const bodyObserver = new ResizeObserver(updateScrollHint);
  bodyObserver.observe(body);
  form.addEventListener('change', event => {
    if (event.target.type !== 'radio') return;
    form.querySelectorAll('.website-pill, .channel-option').forEach(label => label.classList.toggle('selected', label.querySelector('input').checked));
    syncSetup();
    syncContact();
    clearError();
  });
  form.querySelector('.intake-back').addEventListener('click', () => {
    if (sending) return;
    if (step === 1) shell.querySelector('.cta-form-close').click();
    else showStep(step - 1);
  });
  next.addEventListener('click', () => { if (!sending && currentValid()) showStep(step + 1); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    if (step < 4) { if (currentValid()) showStep(step + 1); return; }
    if (!currentValid()) return;
    const answers = Object.fromEntries(new FormData(form));
    if (answers.companyFax) { showError('Please email jamil@thereadyconsult.com to continue.'); return; }
    if (form.elements.hasDomain.value === 'YES' && websiteDomain()) answers.ownedDomain = websiteDomain();
    if (live) {
      sending = true;
      const lockedFields = Array.from(form.querySelectorAll('input, textarea, button')).map(field => [field, field.disabled]);
      lockedFields.forEach(([field]) => { field.disabled = true; });
      submit.textContent = 'Sending…';
      clearError();
      try {
        if (typeof window.trcIntakeTransport !== 'function') throw Error('The form is temporarily unavailable. Please try again.');
        const result = await window.trcIntakeTransport(answers, form.querySelector('.intake-challenge'));
        if (result.accepted !== true) throw Error('We could not confirm delivery. Please try again.');
        options.querySelector('.call-link').href = result.bookingUrl;
        options.querySelector('.checkout-link').href = result.checkoutUrl;
      } catch (failure) {
        showError(failure.message || 'We could not confirm delivery. Please try again; your details are still here.');
        return;
      } finally {
        sending = false;
        lockedFields.forEach(([field, disabled]) => { field.disabled = disabled; });
        submit.textContent = 'Continue';
      }
    } else {
      // Keep preview answers only in this open page. No live transport is called.
      form.previewAnswers = answers;
    }
    shell.hidden = true;
    options.hidden = false;
    options.scrollTop = 0;
    options.querySelector('h2').focus({ preventScroll: true });
  });
  window.trcIntakeCleanup = () => {
    bodyObserver.disconnect();
    const placeholder = document.createElement('form');
    placeholder.id = 'signup-form';
    form.replaceWith(placeholder);
    shell.querySelector('.cta-form-close').hidden = false;
    shell.hidden = false;
    options.hidden = true;
  };
  showStep(1, false);
  heading.setAttribute('aria-live', 'polite');
  if (dialog.open) heading.focus({ preventScroll: true });
})();
