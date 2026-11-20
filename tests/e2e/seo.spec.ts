import { expect, test } from '@playwright/test';
import { routes } from './routes';

test('sitemap lists every route on the production URL', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const r of routes) expect(xml).toContain(`<loc>https://ilacore.com${r === '/' ? '' : r}</loc>`);
});

test('robots allows crawling and points at the sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toContain('Allow: /');
  expect(txt).toContain('Sitemap: https://ilacore.com/sitemap.xml');
});

test('every route has a unique title, one description and one canonical', async ({ page }) => {
  const titles = new Set<string>();
  for (const r of routes) {
    await page.goto(r);
    titles.add(await page.title());
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }
  expect(titles.size).toBe(routes.length);
});

test('home has Organization JSON-LD and product pages add Product JSON-LD', async ({ page }) => {
  await page.goto('/');
  const home = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(home.some((s) => JSON.parse(s)['@type'] === 'Organization')).toBe(true);
  await page.goto('/fms');
  const fms = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(fms.some((s) => JSON.parse(s)['@type'] === 'Product')).toBe(true);
});

test('Open Graph image renders', async ({ request }) => {
  const res = await request.get('/opengraph-image');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});
