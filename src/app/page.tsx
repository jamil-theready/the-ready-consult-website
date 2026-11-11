import type { Metadata } from 'next';
import Script from 'next/script';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const metadata: Metadata = {
  title: 'Websites and Monthly SEO for Contractors | The Ready Consult',
  description: 'A new website, monthly SEO improvements, lead alerts, and reporting in one subscription. The Ready Consult helps contractors get found and turn searches into inquiries.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Websites and Monthly SEO for Contractors | The Ready Consult',
    description: 'A new website and monthly SEO in one subscription, with lead alerts and clear reporting.',
    url: 'https://www.thereadyconsult.com/',
    type: 'website',
  },
};

const page = readFileSync(join(process.cwd(), 'site/light-home.html'), 'utf8');
const css = page.split('<style>')[1]?.split('</style>')[0];
const body = page.split('<body>')[1]?.split('<script src="/assets/light-home.js"></script>')[0];
if (!css || !body || !body.includes('id="pricing"') || !body.includes('id="faq"')) {
  throw new Error('Light homepage source is incomplete.');
}

export default function Home() {
  return <>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <link rel="stylesheet" href="/assets/intake-flow.css" />
    <div id="main-content" dangerouslySetInnerHTML={{ __html: body }} />
    <Script src="/assets/light-home.js?v=20261111-intake" strategy="afterInteractive" />
  </>;
}
