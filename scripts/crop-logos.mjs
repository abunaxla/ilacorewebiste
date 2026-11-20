import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const files = {
  'logo-color.svg': 'brand/ILACORE LOGO color.svg',
  'logo-white.svg': 'brand/ILACORE LOGO WHITE.svg',
  'mark-color.svg': 'brand/ILACORE LOGO COLOR ONLY.svg',
  'mark-white.svg': 'brand/ILACORE LOGO WHITE ONLY.svg',
};

mkdirSync('public/brand', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [out, src] of Object.entries(files)) {
  const svg = readFileSync(src, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '');
  await page.setContent(`<body style="margin:0">${svg}</body>`);
  const box = await page.evaluate(() => {
    const b = document.querySelector('svg').getBBox();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  const pad = 4;
  const viewBox = [box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2].map((n) => n.toFixed(2)).join(' ');
  writeFileSync(`public/brand/${out}`, svg.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`).trim() + '\n');
  console.log(out, viewBox, 'ratio', (box.w / box.h).toFixed(2));
}
await browser.close();
