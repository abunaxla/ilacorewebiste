import { expect, test } from '@playwright/test';

test('FMS page has its promise, sections and a pre-selected demo link', async ({ page }) => {
  await page.goto('/fms');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ILACORE FMS');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Petrol station management system');
  await expect(page).toHaveTitle('Petrol Station Management System | ILACORE FMS');
  await expect(page.getByText('See every pump, tank and shift at your stations, as it happens.')).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: 'Book a demo' }).first()).toHaveAttribute('href', '/demo?product=fms');
  for (const h of ['What it stops', 'What it does', 'What we install', "Who it's for"]) {
    await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
  }
  // Built but not live: these must sit in Coming soon, never in the live feature list.
  const soon = page.getByRole('region', { name: 'Coming soon' });
  await expect(soon).toContainText('Accounting');
  await expect(soon).toContainText('KRA eTIMS invoices');
  await expect(soon).toContainText('Missing-sale and loss alerts');
});

test('Telematics labels the driver companion and crash SOS as coming soon', async ({ page }) => {
  await page.goto('/telematics');
  const soon = page.getByRole('region', { name: 'Coming soon' });
  await expect(soon).toContainText('Spoken in-cab driver companion');
  await expect(soon).toContainText('Automatic crash SOS');
  const outside = await page.locator('main').evaluate((m) => {
    const clone = m.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('section[aria-labelledby="soon"]').forEach((n) => n.remove());
    return clone.textContent ?? '';
  });
  expect(outside).not.toMatch(/driver companion|crash SOS/i);
});

test('product pages emit Product JSON-LD and link to industries', async ({ page }) => {
  await page.goto('/fms');
  const blocks = await page.locator('main script[type="application/ld+json"]').allTextContents();
  // Page content has no `<`, so this guards the output shape only; the escaping itself is unit-tested in json-ld.test.ts.
  for (const b of blocks) expect(b).not.toContain('<');
  const ld = blocks.map((b) => JSON.parse(b)).find((x) => x['@type'] === 'Product');
  expect(ld).toBeTruthy();
  expect(ld.name).toBe('ILACORE FMS');
  await expect(page.locator('main a[href^="/industries#"]').first()).toBeVisible();
});

for (const path of ['/fms', '/telematics']) {
  test(`${path} has no horizontal scroll at 360px`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('coming-soon and unknown products are 404', async ({ page }) => {
  for (const path of ['/lpg', '/nope']) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("This page doesn't exist.");
  }
});

test('each product page answers its own questions, with FAQ structured data', async ({ page }) => {
  for (const [path, name, q] of [
    ['/fms', 'ILACORE FMS', 'Does ILACORE FMS issue KRA eTIMS invoices?'],
    ['/telematics', 'ILACORE Telematics', 'How is an AI dashcam different from a GPS tracker?'],
  ]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 2, name: `Questions about ${name}` })).toBeVisible();
    await expect(page.getByText(q)).toBeVisible();
    const blocks = await page.locator('main script[type="application/ld+json"]').allTextContents();
    const faq = blocks.map((b) => JSON.parse(b)).find((x) => x['@type'] === 'FAQPage');
    expect(faq.mainEntity.some((e: { name: string }) => e.name === q)).toBe(true);
  }
});

test('the depot card stays on the FMS page only', async ({ page }) => {
  await page.goto('/telematics');
  await expect(page.locator('main a[href="/industries#fleet-depots"]')).toHaveCount(0);
  await page.goto('/fms');
  await expect(page.locator('main a[href="/industries#fleet-depots"]')).toHaveCount(1);
});

test('the AI dashcam page is linked from Telematics and stays on its own product', async ({ page }) => {
  await page.goto('/telematics');
  await page.getByRole('link', { name: /AI dashcams for fleets/ }).click();
  await expect(page).toHaveURL(/\/telematics\/ai-dashcam$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI dashcams for fleets');
  await expect(page.getByRole('table')).toBeVisible();
  expect(await page.locator('main').innerText()).not.toMatch(/FMS|fuel|station|companion|\bSOS\b/i);
  const types = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((s) => JSON.parse(s)['@type']);
  expect(types).toEqual(expect.arrayContaining(['BreadcrumbList', 'FAQPage']));
});

test('an unknown product topic is a 404', async ({ request }) => {
  expect((await request.get('/telematics/nope')).status()).toBe(404);
  expect((await request.get('/fms/ai-dashcam')).status()).toBe(404);
});

test('each guide is linked from its product, cites sources and stays on its own product', async ({ page }) => {
  for (const [product, slug, title, off] of [
    ['telematics', 'driver-fatigue-monitoring', 'Driver fatigue monitoring', /FMS|fuel|station|companion|\bSOS\b/i],
    ['fms', 'stop-fuel-theft', 'How to stop fuel theft at a petrol station', /telematics|dashcam|vehicle|fleet|eTIMS/i],
  ] as const) {
    await page.goto(`/${product}`);
    await page.locator(`main a[href="/${product}/${slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${product}/${slug}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.getByRole('heading', { level: 2, name: 'Sources' })).toBeVisible();
    expect(await page.locator('main').innerText()).not.toMatch(off);
  }
  await expect(page.getByText('Automatic missing-sale and loss alerts are in development.')).toHaveCount(1);
});
