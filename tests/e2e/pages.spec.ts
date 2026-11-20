import { expect, test } from '@playwright/test';

test('solutions lists live and coming-soon products', async ({ page }) => {
  await page.goto('/solutions');
  await expect(page.getByRole('link', { name: 'See ILACORE FMS' })).toHaveAttribute('href', '/fms');
  await expect(page.getByRole('link', { name: 'See ILACORE Telematics' })).toHaveAttribute('href', '/telematics');
  await expect(page.locator('main').getByRole('link', { name: 'Register interest' })).toHaveAttribute('href', '/demo?product=lpg&intent=interest');
});

test('industries has four anchored sections', async ({ page }) => {
  await page.goto('/industries');
  for (const id of ['fuel-stations', 'fleet-depots', 'oil-marketing', 'transport']) {
    await expect(page.locator(`section#${id} h2`)).toBeVisible();
  }
});

test('about, privacy and terms render', async ({ page }) => {
  for (const [path, h1] of [['/about', 'About ILACORE'], ['/privacy', 'Privacy policy'], ['/terms', 'Terms of use']]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
  }
});
