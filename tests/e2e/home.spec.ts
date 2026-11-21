import { expect, test } from '@playwright/test';

test('home tells the story in order', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Account for every litre and every kilometre.');
  const h2s = await page.locator('main h2').allTextContents();
  const order = ['ILACORE FMS', 'ILACORE Telematics', 'Works offline', 'How it starts', 'Coming next', 'Common questions', 'Book a demo'];
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

test('no page shows a screenshot placeholder', async ({ page }) => {
  for (const path of ['/', '/fms', '/telematics']) {
    await page.goto(path);
    await expect(page.getByText('Screenshot placeholder')).toHaveCount(0);
  }
});

test('a screenshot enlarges in a dialog and closes again', async ({ page }) => {
  await page.goto('/telematics');
  await page.getByRole('button', { name: /Enlarge this screenshot/ }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});

test('a common question opens to show its answer', async ({ page }) => {
  await page.goto('/');
  const answer = page.getByText('We walk you through the system, answer your questions');
  await expect(answer).toBeHidden();
  await page.getByText('What happens in a demo?').click();
  await expect(answer).toBeVisible();
});

test('product pages show how the hardware connects', async ({ page }) => {
  await page.goto('/fms');
  await expect(page.getByText('Forecourt controller', { exact: true })).toBeVisible();
  await page.goto('/telematics');
  await expect(page.getByText('AI dashcam', { exact: true })).toBeVisible();
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
