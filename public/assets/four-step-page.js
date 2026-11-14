(() => {
  const lifecycle = new AbortController();
  const cleanup = [];
  const listen = (target, type, listener, options = {}) => target?.addEventListener(type, listener, { ...options, signal: lifecycle.signal });
  const figures = document.querySelectorAll('.four-figure');
  if ('IntersectionObserver' in window) {
    const figureObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('four-motion-active', entry.isIntersecting));
    }, { threshold: .05 });
    figures.forEach(figure => figureObserver.observe(figure));
    cleanup.push(() => figureObserver.disconnect());
  } else {
    figures.forEach(figure => figure.classList.add('four-motion-active'));
  }

  const map = document.querySelector('.four-business-v3-map');
  if (map && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    let visible = false;
    let loaded = false;
    let fallback;
    map.classList.add('four-map-ready');
    const revealMap = () => {
      if (!visible || !loaded) return;
      clearTimeout(fallback);
      map.classList.add('four-map-revealed');
    };
    listen(map.querySelector('iframe'), 'load', () => { loaded = true; revealMap(); }, { once: true });
    const mapObserver = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (!visible) return;
      // Cached or unavailable external tiles must never leave the location hidden.
      fallback ??= setTimeout(() => { loaded = true; revealMap(); }, 1200);
      revealMap();
    }, { threshold: .3 });
    mapObserver.observe(map);
    cleanup.push(() => { mapObserver.disconnect(); clearTimeout(fallback); });
  }

  const dialog = document.querySelector('#four-intake-dialog');
  if (!dialog) return;
  const shell = dialog.querySelector('.cta-form-shell');
  const options = dialog.querySelector('.signup-flow-card');
  const panel = dialog.querySelector('.four-intake-panel');
  const header = document.querySelector('.four-header');
  let trigger;
  let surfaceMotion;
  let contentMotion;
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncIntakeFrame() {
    const headerHeight = Math.ceil(header?.getBoundingClientRect().height || 0);
    document.documentElement.style.setProperty('--four-intake-top', `${headerHeight}px`);
  }
  if (header) {
    const headerObserver = new ResizeObserver(syncIntakeFrame);
    headerObserver.observe(header);
    cleanup.push(() => headerObserver.disconnect());
  }
  listen(window, 'resize', syncIntakeFrame);

  function buttonTransform(source, destination) {
    const x = source.left + source.width / 2 - destination.left - destination.width / 2;
    const y = source.top + source.height / 2 - destination.top - destination.height / 2;
    return `translate(${x}px, ${y}px) scale(${source.width / destination.width}, ${source.height / destination.height})`;
  }
  function visibleTrigger() {
    if (!trigger?.isConnected) return null;
    const rect = trigger.getBoundingClientRect();
    return rect.width && rect.height && rect.bottom > 0 && rect.top < innerHeight ? rect : null;
  }

  function openIntake(source) {
    if (dialog.open) return;
    trigger = source || trigger;
    const start = visibleTrigger();
    document.body.classList.add('four-intake-open');
    syncIntakeFrame();
    dialog.showModal();
    dialog.dataset.phase = reduceMotion() ? 'open' : 'opening';
    dialog.dataset.entryEffect = start ? 'from-button' : 'soft-reveal';
    if (!reduceMotion()) {
      const destination = dialog.getBoundingClientRect();
      const corner = getComputedStyle(dialog).borderRadius;
      surfaceMotion = dialog.animate([
        { transform: start ? buttonTransform(start, destination) : 'translateY(18px) scale(.97)', opacity: start ? 1 : 0, borderRadius: start ? '999px' : corner },
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1, borderRadius: corner },
      ], { duration: start ? 580 : 420, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
      contentMotion = panel.animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 320, delay: start ? 150 : 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
      surfaceMotion.onfinish = () => {
        dialog.dataset.phase = 'open';
        surfaceMotion.cancel();
        contentMotion.cancel();
      };
    }
    const heading = dialog.querySelector(dialog.dataset.view === 'booking' ? '.signup-booking h2' : dialog.dataset.view === 'checkout' ? '.signup-checkout h2' : shell.hidden ? '.signup-choice-heading' : '.intake-heading');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }
  function closeIntake() {
    if (!dialog.open || dialog.dataset.phase === 'closing') return;
    if (reduceMotion()) { dialog.close(); return; }
    const current = getComputedStyle(dialog);
    const from = { transform: current.transform, opacity: current.opacity, borderRadius: current.borderRadius };
    const contentOpacity = getComputedStyle(panel).opacity;
    surfaceMotion?.cancel();
    contentMotion?.cancel();
    const destination = visibleTrigger();
    const surface = dialog.getBoundingClientRect();
    dialog.dataset.phase = 'closing';
    surfaceMotion = dialog.animate([
      from,
      { transform: destination ? buttonTransform(destination, surface) : 'translateY(10px) scale(.98)', opacity: 0, borderRadius: destination ? '999px' : from.borderRadius },
    ], { duration: 260, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' });
    contentMotion = panel.animate([{ opacity: contentOpacity }, { opacity: 0 }], { duration: 140, fill: 'both' });
    surfaceMotion.onfinish = () => dialog.close();
  }

  listen(document, 'click', event => {
    const action = event.target.closest('a[href="#signup"]');
    if (!action) return;
    event.preventDefault();
    openIntake(action);
  });
  listen(shell.querySelector('.cta-form-close'), 'click', closeIntake);
  listen(options.querySelector('.checkout-back'), 'click', closeIntake);
  listen(dialog, 'cancel', event => { event.preventDefault(); closeIntake(); });
  listen(dialog, 'close', () => {
    // close() queues its event. A remount may reopen this same dialog before
    // that old event arrives; it must not cancel the new opening or body lock.
    if (dialog.open) return;
    surfaceMotion?.cancel();
    contentMotion?.cancel();
    dialog.dataset.phase = 'closed';
    document.body.classList.remove('four-intake-open');
    trigger?.focus({ preventScroll: true });
  });
  // The existing intake script mounts after this adapter, before DOMContentLoaded.
  function initializeIntake() {
    dialog.querySelector('.intake-heading')?.setAttribute('aria-live', 'polite');
    if (location.hash === '#signup') openIntake();
  }
  listen(window, 'hashchange', () => { if (location.hash === '#signup') openIntake(); });
  window.trcPageCleanup = () => {
    lifecycle.abort();
    cleanup.forEach(dispose => dispose());
    if (surfaceMotion) surfaceMotion.onfinish = null;
    surfaceMotion?.cancel();
    contentMotion?.cancel();
    if (dialog.open) dialog.close();
    dialog.dataset.phase = 'closed';
    document.body.classList.remove('four-intake-open');
    document.documentElement.style.removeProperty('--four-intake-top');
  };
  if (document.readyState === 'loading') listen(document, 'DOMContentLoaded', initializeIntake, { once: true });
  else initializeIntake();
})();
