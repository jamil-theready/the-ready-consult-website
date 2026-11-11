import { describe, expect, it } from 'vitest';
import * as intake from './intake';

const valid = { firstName:' Test ', lastName:'Contractor', email:' TEST@EXAMPLE.COM ', phone:'+1 (202) 555-0142', businessName:'TEST Contractor', preferredContact:'EMAIL', hasWebsite:'NO', requestedDomain:'Example.COM', websiteUrl:'https://stale.example.org', message:'' };
describe('website intake contract', () => {
  it('normalizes contact identity and drops the inactive website branch', () => {
    expect(intake.normalizeIntake(valid)).toMatchObject({firstName:'Test',email:'test@example.com',phone:'+12025550142',websiteUrl:'',requestedDomain:'example.com'});
    expect(intake.normalizeIntake({...valid,phone:''}).phone).toBe('');
    expect(() => intake.normalizeIntake({...valid,phone:'',preferredContact:'WHATSAPP'})).toThrow();
  });
  it('keeps website details optional on the third step', () => {
    expect(intake.normalizeIntake({...valid,hasWebsite:'YES',websiteUrl:''}).websiteUrl).toBe('');
    expect(intake.normalizeIntake({...valid,hasWebsite:'YES',websiteUrl:'example.org'})).toMatchObject({websiteUrl:'https://example.org/',requestedDomain:''});
    expect(intake.normalizeIntake({...valid,requestedDomain:''}).requestedDomain).toBe('');
    expect(intake.normalizeIntake({...valid,hasWebsite:'',requestedDomain:'',message:''})).toMatchObject({hasWebsite:'',websiteUrl:'',requestedDomain:'',message:''});
  });
  it.each([{email:'not-email'}, {firstName:''}, {lastName:''}, {businessName:''}, {phone:'2025550142'}, {preferredContact:'anything'}, {hasWebsite:'MAYBE'}, {requestedDomain:'https://example.com/path'}, {message:'x'.repeat(4001)}, {hasWebsite:'YES',websiteUrl:'javascript:alert(1)'}, {hasWebsite:'YES',websiteUrl:'https://user:pass@example.com'}])('rejects malformed or oversized input %j', change => {
    expect(() => intake.normalizeIntake({...valid,...change})).toThrow();
  });
  it('places solicitation in review without treating ordinary SEO interest as spam', () => {
    expect(intake.normalizeIntake({...valid,message:'I need SEO for my concrete business'}).reviewReasons).toEqual([]);
    expect(intake.normalizeIntake({...valid,businessName:'Selling backlinks',message:''}).reviewReasons).toContain('possible solicitation');
    expect(intake.normalizeIntake({...valid,companyFax:'bot'}).reviewReasons).toContain('honeypot');
  });
  it('produces a versioned transport with a stable submission identity', () => {
    const payload = intake.buildSubmission(valid,'trc-test-123');
    expect(payload.email).toBe('test@example.com');
    expect(payload.name).toBe('Test Contractor');
    expect(payload.business).toBe('TEST Contractor');
    expect(JSON.parse(payload.trc_intake)).toMatchObject({version:1,submissionId:'trc-test-123',lead:{email:'test@example.com',hasWebsite:'NO'}});
    expect(() => intake.buildSubmission(valid,'bad\nidentity')).toThrow();
  });
});
