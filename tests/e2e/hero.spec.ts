import { expect, test } from '@playwright/test';

test('animates for normal motion', async ({ page }) => {
  await page.goto('/');
  const fig = page.getByTestId('hero-instrument');
  await expect(fig).toHaveAttribute('data-static', 'false');
  const first = await fig.getByTestId('tank-litres').textContent();
  await page.waitForTimeout(1500);
  expect(await fig.getByTestId('tank-litres').textContent()).not.toBe(first);
});

test('is static with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const fig = page.getByTestId('hero-instrument');
  await expect(fig).toHaveAttribute('data-static', 'true');
  const first = await fig.getByTestId('tank-litres').textContent();
  await page.waitForTimeout(1500);
  expect(await fig.getByTestId('tank-litres').textContent()).toBe(first);
});

test('describes itself to screen readers', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-instrument').locator('figcaption')).toContainText('litres');
});

test('pause button toggles aria-pressed and its label', async ({ page }) => {
  await page.goto('/');
  const fig = page.getByTestId('hero-instrument');
  await expect(fig).toHaveAttribute('data-static', 'false');
  const btn = fig.getByRole('button', { name: 'Pause animation' });
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await btn.click();
  const resume = fig.getByRole('button', { name: 'Play animation' });
  await expect(resume).toHaveAttribute('aria-pressed', 'true');
  await resume.click();
  await expect(fig.getByRole('button', { name: 'Pause animation' })).toHaveAttribute('aria-pressed', 'false');
});
