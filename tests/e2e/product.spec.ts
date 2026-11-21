import { expect, test } from '@playwright/test';

test('FMS page has its promise, sections and a pre-selected demo link', async ({ page }) => {
  await page.goto('/fms');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ILACORE FMS');
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
  const raw = (await page.locator('main script[type="application/ld+json"]').textContent()) ?? '{}';
  // Page content has no `<`, so this guards the output shape only; the escaping itself is unit-tested in json-ld.test.ts.
  expect(raw).not.toContain('<');
  const ld = JSON.parse(raw);
  expect(ld['@type']).toBe('Product');
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
