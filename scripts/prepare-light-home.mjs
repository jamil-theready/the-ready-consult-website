import { copyFile, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = resolve('site/light-home.html');
const output = resolve('out/index.html');
const html = await readFile(source, 'utf8');
for (const marker of ['class="site-hero"', 'id="pricing"', 'id="faq"', '/assets/intake-flow.js']) {
  if (!html.includes(marker)) throw new Error(`Light homepage missing ${marker}`);
}
await stat(output);
await copyFile(source, output);
console.log('Installed the light homepage in the static export.');
