"use client";

import { useEffect, useState } from 'react';
import { checkoutUrl } from '@/lib/intake-transport';

export default function ThankYouActions() {
  const [payment, setPayment] = useState('');
  const [booking, setBooking] = useState('https://calendly.com/thereadyconsult/30min');
  useEffect(() => {
    try {
      setPayment(checkoutUrl(sessionStorage.getItem('trc-checkout-url') || ''));
      const id = sessionStorage.getItem('trc-submission-id') || '';
      if (/^[0-9a-f-]{36}$/i.test(id)) setBooking(`https://calendly.com/thereadyconsult/30min?utm_content=${encodeURIComponent(id)}`);
    } catch { /* storage is optional */ }
  }, []);
  return <div className="mt-10 flex flex-wrap gap-4">
    {payment && <a href={payment} className="rounded-full bg-[#1a130a] px-7 py-4 text-sm font-semibold text-white">Pay now · $103.30/month</a>}
    <a href={booking} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#bfc5cc] px-7 py-4 text-sm font-semibold text-[#1a130a]">Set up a call</a>
  </div>;
}
