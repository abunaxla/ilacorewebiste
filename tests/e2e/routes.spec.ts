import { expect, test } from '@playwright/test';
import { routes } from './routes';

for (const r of routes) {
  test(`${r} returns 200 with exactly one h1 and a focusable main`, async ({ page }) => {
    const res = await page.goto(r);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main')).toHaveAttribute('tabindex', '-1');
  });

  for (const width of [360, 768, 1440]) {
    test(`${r} has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(r);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test('pages contain no banned words', async ({ page }) => {
  for (const r of routes) {
    await page.goto(r);
    expect(await page.locator('main').innerText()).not.toMatch(/seamless|unlock|empower/i);
  }
});

test('the active nav link carries aria-current in header and mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/fms');
  const header = page.getByRole('banner');
  await expect(header.getByRole('link', { name: 'FMS', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(header.getByRole('link', { name: 'About', exact: true })).not.toHaveAttribute('aria-current', 'page');
  await page.setViewportSize({ width: 375, height: 812 });
  await header.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'FMS', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('new-tab links announce that they open a new tab', async ({ page }) => {
  await page.goto('/demo');
  const links = page.locator('a[target="_blank"]');
  expect(await links.count()).toBeGreaterThan(0);
  for (const text of await links.allInnerTexts()) expect(text).toMatch(/opens in a new tab/i);
});
