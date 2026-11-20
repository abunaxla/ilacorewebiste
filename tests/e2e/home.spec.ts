import { expect, test } from '@playwright/test';

test('home tells the story in order', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Account for every litre and every kilometre.');
  const h2s = await page.locator('main h2').allTextContents();
  const order = ['ILACORE FMS', 'ILACORE Telematics', 'Works offline', 'How it starts', 'Coming next', 'Book a demo'];
  const idx = order.map((t) => h2s.findIndex((h) => h.includes(t)));
  expect(idx.every((i) => i >= 0)).toBe(true);
  expect([...idx].sort((a, b) => a - b)).toEqual(idx);
});

test('hero actions go to the demo and WhatsApp', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  await expect(main.getByRole('link', { name: 'Book a demo' }).first()).toHaveAttribute('href', '/demo');
  await expect(main.getByRole('link', { name: 'Chat on WhatsApp' }).first()).toHaveAttribute('href', /wa\.me/);
});

test('coming next registers interest for LPG', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Register interest' })).toHaveAttribute('href', '/demo?product=lpg&intent=interest');
});

test('placeholder screenshots are clearly marked', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Screenshot placeholder').first()).toBeVisible();
});

test('coming-soon LPG outcomes are never shown as live', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('In development', { exact: true })).toHaveCount(0);
});

test('has no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
