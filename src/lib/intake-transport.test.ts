import {describe,it,expect,vi} from 'vitest';
import {bridgePayload,checkoutUrl,retryIdentity,sendIntake} from './intake-transport';
const id='c71468b1-f325-43da-b5b8-78aa4a53d940';
const input={firstName:' Test ',lastName:'Person',businessName:'Builder',email:'TEST@example.com',phone:'+1 (202) 555-0142',preferredContact:'WHATSAPP',hasWebsite:'NO',requestedDomain:'Example.com',message:''};
const config={bridge:'https://bridge.example/v1/intake',siteKey:'public',token:'challenge',fallbackKey:'fallback'};
describe('intake adapter',()=>{
 it('preserves the real contact preference, normalizes identity, and retains website context',()=>{
  expect(bridgePayload(input,id)).toEqual({submissionId:id,name:'Test Person',email:'test@example.com',phone:'+12025550142',business:'Builder',contactPreference:'whatsapp',whatsappConsent:true,message:'Existing website: No\nPreferred domain: example.com'});
  expect(()=>bridgePayload({...input,preferredContact:'SMS'},id)).toThrow();
  expect(()=>bridgePayload(input,'invalid')).toThrow();
  expect(bridgePayload({...input,hasWebsite:'',requestedDomain:'',message:''},id).message).toBe('');
 });
 it('requires a matching durable receipt',async()=>{
  const request=vi.fn<typeof fetch>(async()=>new Response(JSON.stringify({accepted:true,submissionId:id}),{status:202}));
  await sendIntake(input,id,config,request);
  expect(request).toHaveBeenCalledTimes(1);
  expect(JSON.parse(request.mock.calls[0][1]!.body as string)).toMatchObject({turnstileToken:'challenge',submissionId:id});
 });
 it.each([409,500])('does not fall back on bridge HTTP %s',async status=>{
  const request=vi.fn<typeof fetch>(async()=>new Response('{}',{status}));
  await expect(sendIntake(input,id,config,request)).rejects.toThrow();expect(request).toHaveBeenCalledTimes(1);
 });
 it('does not fall back on network failure or invalid config',async()=>{
  const request=vi.fn(async()=>{throw Error('network');});
  await expect(sendIntake(input,id,config,request)).rejects.toThrow();expect(request).toHaveBeenCalledTimes(1);
  request.mockClear();
  for(const change of [{bridge:'http://bridge.example/v1/intake'},{token:''},{siteKey:''}]) await expect(sendIntake(input,id,{...config,...change},request)).rejects.toThrow();
  expect(request).not.toHaveBeenCalled();
 });
 it('uses the existing transport only if no bridge is configured',async()=>{
  const request=vi.fn<typeof fetch>(async()=>new Response('{"success":true}'));
  await sendIntake(input,id,{...config,bridge:''},request);
  expect(request.mock.calls[0][0]).toBe('https://api.web3forms.com/submit');
 });
 it('reuses durable identity after reload and creates a new identity for edited fields',async()=>{
  const values=new Map();const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);}};
  const make=vi.fn(()=>id);
  expect(await retryIdentity(input,storage,make)).toBe(id);
  expect(await retryIdentity(input,storage,make)).toBe(id);expect(make).toHaveBeenCalledTimes(1);
  await retryIdentity({...input,message:'changed'},storage,make);expect(make).toHaveBeenCalledTimes(2);
  expect([...values.values()].join('')).not.toContain('TEST@example.com');
 });
 it('allows only the Stripe hosted checkout HTTPS origin',()=>{
  expect(checkoutUrl('https://buy.stripe.com/test_reference')).toBe('https://buy.stripe.com/test_reference');
  for(const raw of ['', 'javascript:alert(1)','https://buy.stripe.com.evil.test/a','http://buy.stripe.com/a','https://user:pass@buy.stripe.com/a']) expect(checkoutUrl(raw)).toBe('');
 });
});
