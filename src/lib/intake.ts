// Run again at the trusted intake boundary; browser flags are advisory.
export function normalizeIntake(input: Record<string, unknown>) {
  const text = (key: string, label: string, required = true, max = 200) => {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > max || /[\x00-\x1f\x7f]/.test(value.replace(/\r?\n/g, ' '))) throw new Error(`Please check ${label}.`);
    if (required && !value.trim()) throw new Error(`Please enter ${label}.`);
    return value.trim();
  };
  const firstName = text('firstName','your first name',true,79);
  const lastName = text('lastName','your last name',true,80);
  const businessName = text('businessName','your business name');
  const email = text('email','your email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  const phone = text('phone','your phone number',false).replace(/[ ().-]/g,'');
  if (phone && !/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Include your country code, for example +1 202 555 0142.');
  const preferredContact = text('preferredContact','a contact preference');
  if (!['EMAIL','WHATSAPP'].includes(preferredContact)) throw new Error('Please choose email or WhatsApp.');
  if (preferredContact === 'WHATSAPP' && !phone) throw new Error('Please enter your WhatsApp number.');
  const hasWebsite = text('hasWebsite','whether you have a website',false);
  if (!['YES','NO',''].includes(hasWebsite)) throw new Error('Please choose Yes or No for your website.');
  let websiteUrl = '', requestedDomain = '';
  if (hasWebsite === 'YES') {
    const raw = text('websiteUrl','your website address',false,500);
    if (raw) try {
      const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
      if (!['https:','http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error();
      websiteUrl = url.href;
    } catch { throw new Error('Please enter a valid website address, such as yourbusiness.com.'); }
  } else {
    requestedDomain = text('requestedDomain','your preferred domain',false,253).toLowerCase();
    if (requestedDomain && !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(requestedDomain)) throw new Error('Enter a domain like yourbusiness.com, without a path.');
  }
  const message = text('message','your message',false,4000);
  const companyFax = text('companyFax','the form',false);
  const reviewReasons: string[] = [];
  if (companyFax) reviewReasons.push('honeypot');
  if (/\b(?:sell(?:ing)? backlinks|guest post(?:ing)? services|white[- ]label seo|outsourc(?:e|ing) to us)\b/i.test([businessName,firstName,lastName,message].join(' '))) reviewReasons.push('possible solicitation');
  return {firstName,lastName,businessName,email,phone,preferredContact,hasWebsite,websiteUrl,requestedDomain,message,companyFax,reviewReasons};
}

export function buildSubmission(input: Record<string, unknown>, submissionId: string) {
  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(submissionId)) throw new Error('Invalid submission reference.');
  const lead = normalizeIntake(input);
  return {name:`${lead.firstName} ${lead.lastName}`, email:lead.email, business:lead.businessName,
    phone:lead.phone, contact_via:lead.preferredContact, website:lead.websiteUrl,
    requested_domain:lead.requestedDomain, message:lead.message,
    subject:`TRC website inquiry — ${submissionId}`,
    trc_intake:JSON.stringify({version:1,submissionId,lead})};
}
