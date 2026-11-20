import { expect, test } from '@playwright/test';

test('desktop header shows nav and Book a demo', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const header = page.getByRole('banner');
  for (const label of ['FMS', 'Telematics', 'Solutions', 'Industries', 'About']) {
    await expect(header.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await expect(header.getByRole('link', { name: 'Book a demo' })).toHaveAttribute('href', '/demo');
});

test('skip link is the first focusable element and targets main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#main')).toBeFocused();
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('keeps Book a demo pinned and opens the menu by keyboard', async ({ page }) => {
    await page.goto('/');
    const header = page.getByRole('banner');
    await expect(header.getByRole('link', { name: 'Book a demo' })).toBeVisible();
    await header.getByRole('button', { name: 'Open menu' }).focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('link', { name: 'Telematics', exact: true })).toBeVisible();
    const demo = dialog.getByRole('link', { name: 'Book a demo' });
    await expect(demo).toBeVisible();
    await expect(demo).toBeEnabled();
    await expect(demo).toHaveAttribute('href', '/demo');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(header.getByRole('button', { name: 'Open menu' })).toBeFocused();
  });

  test('does not overflow horizontally at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test('footer has contact and legal links', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  await expect(footer.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  await expect(footer.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /wa\.me/);
});
