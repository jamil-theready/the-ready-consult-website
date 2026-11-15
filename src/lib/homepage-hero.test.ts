import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';

const page = readFileSync('site/four-step-home.html', 'utf8');
const body = page.split('<body>')[1];

describe('approved homepage hero', () => {
  it('keeps the original hero before the five-step presentation, with one page heading', () => {
    expect(body.indexOf('id="hero"')).toBeGreaterThan(0);
    expect(body.indexOf('id="hero"')).toBeLessThan(body.indexOf('id="business"'));
    expect(body.match(/<h1\b/g)).toHaveLength(1);
    const hero = body.slice(body.indexOf('id="hero"'), body.indexOf('id="business"'));
    expect(hero).toContain('Rank #1');
    expect(hero).toContain('One subscription.');
    expect(hero).toContain('href="#signup"');
    expect(hero).toContain('href="#business"');
    expect(body).toContain('<h2 class="four-title" id="four-business-title">');
  });

  it('retains the approved search icons, horizontal steps and clean live-site video', () => {
    const hero = body.slice(body.indexOf('id="hero"'), body.indexOf('id="business"'));
    for (const file of ['google-g.svg', 'chatgpt.svg', 'claude.svg', 'gemini.svg', 'trc-live-hero-clean.mp4', 'trc-live-hero-clean-poster.jpg']) {
      expect(hero).toContain(`/assets/${file}`);
      expect(statSync(`public/assets/${file}`).size).toBeGreaterThan(0);
    }
    expect(hero.match(/class="hero-step-number"/g)).toHaveLength(4);
  });
});
