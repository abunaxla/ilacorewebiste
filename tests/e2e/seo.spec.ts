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

test('home has Organization JSON-LD and product pages add Service JSON-LD', async ({ page }) => {
  await page.goto('/');
  const home = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(home.some((s) => JSON.parse(s)['@type'] === 'Organization')).toBe(true);
  await page.goto('/fms');
  const fms = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(fms.some((s) => JSON.parse(s)['@type'] === 'Service')).toBe(true);
});

test('Open Graph image renders', async ({ request }) => {
  const res = await request.get('/opengraph-image');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});

test('the sitemap dates every page', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml.match(/<lastmod>\d{4}-\d{2}-\d{2}/g)).toHaveLength(routes.length);
});

test('every route names its own address in social previews', async ({ page }) => {
  for (const r of routes) {
    await page.goto(r);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://ilacore.com${r === '/' ? '' : r}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  }
});

test('each product has its own social preview image', async ({ page, request }) => {
  for (const [r, product] of [['/fms', 'fms'], ['/telematics', 'telematics'], ['/fms/tank-monitoring', 'fms']]) {
    await page.goto(r);
    const src = await page.locator('meta[property="og:image"]').getAttribute('content');
    const { pathname, search } = new URL(src!);
    expect(pathname).toMatch(new RegExp(`^/${product}/opengraph-image`));
    const res = await request.get(pathname + search);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  }
});

test('home names the site, and the company details have a logo that loads', async ({ page, request }) => {
  await page.goto('/');
  const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((s) => JSON.parse(s));
  expect(blocks.find((b) => b['@type'] === 'WebSite')?.name).toBe('ILACORE');
  const org = blocks.find((b) => b['@type'] === 'Organization');
  expect(org.telephone).toBe('+254700000000');
  const logo = await request.get(new URL(org.logo).pathname);
  expect(logo.headers()['content-type']).toContain('image/png');
});
