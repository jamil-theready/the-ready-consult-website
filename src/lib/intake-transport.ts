import { normalizeIntake, buildSubmission } from './intake';

export function checkoutUrl(raw = '') {
  try { const url = new URL(raw); return url.origin === 'https://buy.stripe.com' && !url.username && !url.password && url.pathname.length > 1 ? url.href : ''; } catch { return ''; }
}
export function bridgeUrl(raw: string) {
  try { const url = new URL(raw); if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/v1/intake') throw Error(); return url.href; } catch { throw Error('This form is temporarily unavailable. Please email jamil@thereadyconsult.com.'); }
}
export function bridgePayload(input: Record<string, unknown>, submissionId: string) {
  const lead = normalizeIntake(input);
  const preference = {EMAIL:'email',WHATSAPP:'whatsapp'}[lead.preferredContact];
  if (!preference) throw Error('Please choose email or WhatsApp.');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) throw Error('Invalid submission reference.');
  const message = [lead.message, lead.hasWebsite === 'YES' ? `Existing website: ${lead.websiteUrl || 'Address not provided'}` : lead.hasWebsite === 'NO' ? 'Existing website: No' : '', lead.requestedDomain ? `Preferred domain: ${lead.requestedDomain}` : ''].filter(Boolean).join('\n');
  if (message.length > 4000) throw Error('Please shorten your message so your website details fit.');
  return {submissionId,name:`${lead.firstName} ${lead.lastName}`,email:lead.email,business:lead.businessName,message,contactPreference:preference,phone:lead.phone,whatsappConsent:preference==='whatsapp'};
}
// Persist only identity + a digest, never the visitor's contact details. An edited inquiry
// gets a new identity; an uncertain delivery retries the identical inquiry with the old one.
export async function retryIdentity(payload: unknown, storage: Pick<Storage,'getItem'|'setItem'>, makeId = () => crypto.randomUUID()): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)), b => b.toString(16).padStart(2,'0')).join('');
  let previous; try { previous = JSON.parse(storage.getItem('trc-intake-retry') || 'null'); } catch { /* fresh identity */ }
  if (previous?.digest === digest && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(previous.id)) return previous.id;
  const id = makeId(); storage.setItem('trc-intake-retry',JSON.stringify({id,digest})); return id;
}
export async function sendIntake(input: Record<string,unknown>, id: string, config: {bridge:string;siteKey:string;token:string;fallbackKey:string}, fetcher: typeof fetch = fetch) {
  if (config.bridge) {
    const endpoint = bridgeUrl(config.bridge);
    if (!config.siteKey || !config.token) throw Error('Please complete the security check and try again.');
    const payload = bridgePayload(input,id);
    const response = await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...payload,turnstileToken:config.token}),signal:AbortSignal.timeout(20000)});
    const result = await response.json();
    if (!response.ok || result.accepted !== true || result.submissionId !== id) throw Error('We could not confirm delivery. Please try again.');
    return {checkoutUrl:checkoutUrl(result.checkoutUrl)};
  }
  if (!config.fallbackKey) throw Error('This form is temporarily unavailable. Please email jamil@thereadyconsult.com.');
  const response = await fetcher('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:config.fallbackKey,from_name:'The Ready Consult',...buildSubmission(input,id)}),signal:AbortSignal.timeout(20000)});
  const result = await response.json();
  if (!response.ok || result.success !== true) throw Error('We could not confirm delivery. Please try again.');
  return {checkoutUrl:''};
}
