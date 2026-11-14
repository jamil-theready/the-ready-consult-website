import type { Metadata } from 'next';
import FiveStepRuntime from '@/components/FiveStepRuntime';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

export const metadata: Metadata = {
  title: 'A Website and Monthly SEO. One Subscription. | The Ready Consult',
  description: 'Tell us about your business. Get a new website, monthly SEO and reporting, hosting, maintenance, and website lead alerts for $103.30/month. No minimum term.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'A Website and Monthly SEO. One Subscription. | The Ready Consult',
    description: 'A new website, monthly SEO and reporting, and website lead alerts in one $103.30 monthly subscription.',
    url: 'https://www.thereadyconsult.com/',
    type: 'website',
    images: [{ url: 'https://www.thereadyconsult.com/og-image.png', width: 1200, height: 630, alt: 'The Ready Consult, websites and monthly SEO for local businesses' }],
  },
};

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const page = read('site/four-step-home.html');
const pageCss = page.match(/<style>([\s\S]*?)<\/style>/)?.[1];
const linkedCss = [...page.matchAll(/<link rel="stylesheet" href="(\/assets\/[^"?]+)(?:\?[^" ]*)?">/g)]
  .map(match => read(`public${match[1]}`));
const css = `${pageCss}\n${linkedCss.join('\n')}`;
const rawBody = page.match(/<body>([\s\S]*?)<\/body>/)?.[1];
if (!pageCss || !rawBody || !rawBody.includes('id="pricing"') || !rawBody.includes('id="four-intake-dialog"')) {
  throw new Error('Five-section homepage source is incomplete.');
}
const body = rawBody
  .replace('class="four-intake-dialog"', 'class="four-intake-dialog" data-intake-mode="live"')
  .replace('<button class="checkout-link choice-button" type="button" disabled>Start subscription</button>', '<a class="checkout-link choice-button" href="#" rel="noopener">Start subscription</a>')
  .replace('<small>Checkout is disabled in this preview.</small>', '')
  .replace('Design preview · Your details stay in this browser. Nothing is submitted or charged.', 'Submitting sends an inquiry, not a charge. Choose a call or secure checkout next.');
const runtime = [read('public/assets/five-step-intake-live.js'), read('public/assets/four-step-page.js'), read('site/four-step-intake.js')].join('\n;\n');
const runtimeVersion = createHash('sha256').update(runtime).digest('hex').slice(0, 12);
const runtimeRegistration = `
window.trcHomeRuntimeVersion = ${JSON.stringify(runtimeVersion)};
window.trcUnmountHome = function () {
  window.trcPageCleanup?.();
  window.trcIntakeCleanup?.();
  window.trcPageCleanup = undefined;
  window.trcIntakeCleanup = undefined;
  if (window.trcMountedHomeRoot) delete window.trcMountedHomeRoot.dataset.trcMounted;
  window.trcMountedHomeRoot = undefined;
};
window.trcMountHome = function () {
  const root = document.getElementById('four-intake-dialog');
  if (!root || root.dataset.trcMounted === 'true') return;
  window.trcUnmountHome();
  window.trcMountedHomeRoot = root;
  root.dataset.trcMounted = 'true';
  ${runtime}
};`;

export default function Home() {
  return <>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <div id="main-content" dangerouslySetInnerHTML={{ __html: body }} />
    <FiveStepRuntime source={runtimeRegistration} version={runtimeVersion} />
  </>;
}
