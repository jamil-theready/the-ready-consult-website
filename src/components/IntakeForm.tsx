"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { WEB3FORMS_KEY } from '@/lib/forms';
import IntakeChallenge from './IntakeChallenge';
import { normalizeIntake } from '@/lib/intake';
import { retryIdentity, sendIntake } from '@/lib/intake-transport';
const BRIDGE = process.env.NEXT_PUBLIC_TRC_INTAKE_URL || '';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

const LABEL = 'block text-[13px] font-semibold text-navy mb-2';
const INPUT = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[15px] placeholder:text-gray-400 focus:outline-none';

function ContactIcon({channel}: {channel: string}) {
  return <Image src={channel === 'WHATSAPP' ? '/whatsapp-icon.svg' : '/gmail-icon.svg'} alt="" width={28} height={28} className="h-7 w-7 object-contain" />;
}

export default function IntakeForm({onExit}: {onExit: () => void}) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [step,setStep] = useState(1);
  const [website, setWebsite] = useState('NO');
  const [channel, setChannel] = useState('WHATSAPP');
  const [phone,setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const submissionId = useRef('');
  const fingerprint = useRef('');
  const [token, setToken] = useState('');
  const [attempt, setAttempt] = useState(0);

  function next() {
    setError('');
    const current = form.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!current) return;
    for (const field of current.querySelectorAll<HTMLInputElement>('input[required]')) if (!field.reportValidity()) return;
    if (step === 2) {
      if (!channel) { setError('Choose WhatsApp or Email.'); return; }
      if (channel === 'WHATSAPP' && !/^\+[1-9]\d{7,14}$/.test(phone.replace(/[ ().-]/g,''))) {
        setError('Enter your WhatsApp number with country code, for example +1 202 555 0142.'); return;
      }
    }
    setStep(value => Math.min(4,value+1));
  }

  function goBack() {
    setError('');
    if (step === 1) { onExit(); return; }
    if (step === 4) setToken('');
    setStep(value => value-1);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 4 || inFlight.current) return;
    setError('');
    const input = Object.fromEntries(new FormData(event.currentTarget));
    if (input.companyFax) { router.push('/thank-you'); return; }
    inFlight.current = true;
    setSending(true);
    try {
      const normalized = normalizeIntake(input);
      const current = JSON.stringify(normalized);
      if (fingerprint.current !== current) { submissionId.current = ''; fingerprint.current = current; }
      try { submissionId.current = await retryIdentity(normalized, sessionStorage); }
      catch { submissionId.current ||= crypto.randomUUID(); }
      const receipt = await sendIntake(input, submissionId.current, {bridge:BRIDGE,siteKey:SITE_KEY,token,fallbackKey:WEB3FORMS_KEY || ''});
      try { sessionStorage.setItem('trc-checkout-url',receipt.checkoutUrl); } catch { /* optional storage */ }
      try { sessionStorage.setItem('trc-submission-id',submissionId.current); } catch { /* optional storage */ }
      try { sessionStorage.removeItem('trc-intake-retry'); } catch { /* optional storage */ }
      router.push('/thank-you');
    } catch (reason) {
      setError(reason instanceof Error && reason.name !== 'TimeoutError' ? reason.message : 'We could not confirm delivery. Please try again; your details are still here.');
    } finally { inFlight.current = false; setSending(false); if (BRIDGE) {setToken('');setAttempt(value=>value+1);} }
  }

  return <form ref={form} noValidate onSubmit={onSubmit} className="intake-form space-y-8">
    <div className="flex items-baseline justify-between gap-5">
      <button type="button" onClick={goBack} className="intake-back text-navy hover:underline underline-offset-4">← Back</button>
      <div aria-label={`Step ${step} of 4`} className="intake-progress inline-flex items-baseline gap-3 text-navy">
        <span>{String(step).padStart(2,'0')} / 04</span>
        <span aria-hidden="true" className="inline-flex items-center gap-1.5">{[1,2,3,4].map(number => <span key={number} className={`h-1 w-4 rounded-full ${number <= step ? 'bg-navy' : 'bg-gray-300'}`} />)}</span>
      </div>
    </div>
    <div className="intake-heading-slot">
      {step === 1 && <h2>Tell us about your business.</h2>}
      {step === 2 && <h2>How should we reach you?</h2>}
      {step === 3 && <h2>Do you already have a website?</h2>}
      {step === 4 && <h2>Tell us more about your business.</h2>}
    </div>
    <section data-step="1" hidden={step !== 1} className="space-y-6">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div><label className={LABEL} htmlFor="firstName">First name</label><input required maxLength={200} id="firstName" name="firstName" autoComplete="given-name" placeholder=" " className={INPUT} /></div>
      <div><label className={LABEL} htmlFor="lastName">Last name</label><input required maxLength={200} id="lastName" name="lastName" autoComplete="family-name" placeholder=" " className={INPUT} /></div>
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div><label className={LABEL} htmlFor="email">Email</label><input required maxLength={200} type="email" id="email" name="email" autoComplete="email" placeholder=" " className={INPUT} /></div>
      <div><label className={LABEL} htmlFor="businessName">Business name</label><input required maxLength={200} id="businessName" name="businessName" autoComplete="organization" placeholder=" " className={INPUT} /></div>
    </div>
    </section>
    <section data-step="2" hidden={step !== 2}>
    <fieldset><legend className="sr-only">Preferred contact method</legend><div className="grid gap-3 sm:grid-cols-2">{[['WHATSAPP','WhatsApp','Message me on WhatsApp'],['EMAIL','Email','Send me an email']].map(([value,title,subtitle]) => <label key={value} className={`intake-contact-choice flex cursor-pointer items-center gap-3 rounded-2xl p-4 ${channel === value ? 'is-selected' : ''}`}><input type="radio" name="preferredContact" value={value} checked={channel === value} onChange={() => setChannel(value)} /><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm"><ContactIcon channel={value} /></span><span><strong className="block text-navy">{title}</strong><span className="block text-sm text-gray-500">{subtitle}</span></span></label>)}</div></fieldset>
    {channel === 'WHATSAPP' && <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5"><label className={LABEL} htmlFor="phone">Your WhatsApp number</label><input required maxLength={40} type="tel" id="phone" name="phone" autoComplete="tel" value={phone} onChange={event=>setPhone(event.target.value)} placeholder="+1 202 555 0142" className={INPUT} /><p className="mt-2 text-sm text-gray-500">Include your country code. We check the number format before messaging you.</p></div>}
    </section>
    <section data-step="3" hidden={step !== 3} className="space-y-8">
    <fieldset><legend className="sr-only">Do you already have a website?</legend><div className="flex flex-wrap gap-3">{[['YES','Yes'],['NO','No'],['','Not sure yet']].map(([value,label]) => <label key={label} className={`intake-choice ${website === value ? 'is-selected' : ''}`}><input className="sr-only" type="radio" name="hasWebsite" value={value} checked={website === value} onChange={() => setWebsite(value)} /><span>{label}</span></label>)}</div></fieldset>
    {website === 'YES' && <div><label className="intake-subquestion" htmlFor="websiteUrl">What’s your website address? <span className="intake-optional">(optional)</span></label><input maxLength={500} id="websiteUrl" name="websiteUrl" placeholder="yourbusiness.com" autoComplete="url" className={INPUT} /></div>}
    {website === 'NO' && <div><label className="intake-subquestion" htmlFor="requestedDomain">What domain would you like? <span className="intake-optional">(optional)</span></label><input maxLength={253} id="requestedDomain" name="requestedDomain" placeholder="yourbusiness.com" aria-describedby="domain-help" className={INPUT} /><p id="domain-help" className="mt-2 text-sm text-gray-500">Not sure yet? Leave this blank. We will check availability and suggest options when we follow up.</p></div>}
    </section>
    <section data-step="4" hidden={step !== 4} className="space-y-8">
    <div><label className="sr-only" htmlFor="message">Tell us more about your business (optional)</label><textarea maxLength={4000} rows={4} id="message" name="message" className={INPUT} placeholder="For example: residential roof repairs and new roof installations in Austin, Round Rock, and Cedar Park." /></div>
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="companyFax">Leave this blank</label><input id="companyFax" name="companyFax" tabIndex={-1} autoComplete="off" /></div>
    {BRIDGE && !SITE_KEY && <p role="alert" className="text-sm text-navy">This form is temporarily unavailable. Please email <a href="mailto:jamil@thereadyconsult.com" className="underline">jamil@thereadyconsult.com</a>.</p>}
    {BRIDGE && SITE_KEY && step === 4 && <IntakeChallenge siteKey={SITE_KEY} onToken={setToken} attempt={attempt} onError={()=>setError('The security check could not load. Please retry or email jamil@thereadyconsult.com.')}/>}
    <p className="text-xs leading-relaxed text-gray-500">Submitting sends an inquiry, not a charge. You can book a call on the next page; secure checkout appears when available.</p>
    </section>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-navy">{error}</p>}
    <div className="intake-actions flex justify-between gap-3 pt-8">
      {step < 4 ? <button type="button" onClick={next} className="ml-auto w-40 rounded-full bg-navy px-8 py-4 text-[15px] font-semibold text-white">Next</button> : <button type="submit" disabled={sending || Boolean(BRIDGE && !token)} className="ml-auto w-auto min-w-[220px] rounded-full bg-navy px-8 py-4 text-[15px] font-semibold text-white disabled:opacity-60">{sending ? 'Sending…' : 'Continue to your options'}</button>}
    </div>
  </form>;
}
