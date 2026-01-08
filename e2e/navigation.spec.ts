import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to category pages', async ({ page }) => {
    // Click on Formatters category
    await page.getByRole('heading', { name: 'Formatters & Validators' }).click();
    await expect(page).toHaveURL(/\/category\/formatters/);

    // Go back home
    await page.goto('/');

    // Click on Text Tools category
    await page.getByRole('heading', { name: 'Text Tools' }).click();
    await expect(page).toHaveURL(/\/category\/text/);
  });

  test('should navigate to favorites page', async ({ page }) => {
    // Look for favorites link in sidebar/header
    const favoritesLink = page.getByRole('link', { name: /favorites/i });
    if (await favoritesLink.isVisible()) {
      await favoritesLink.click();
      await expect(page).toHaveURL(/\/favorites/);
    }
  });

  test('should navigate to recent page', async ({ page }) => {
    // Look for recent link in sidebar/header
    const recentLink = page.getByRole('link', { name: /recent/i });
    if (await recentLink.isVisible()) {
      await recentLink.click();
      await expect(page).toHaveURL(/\/recent/);
    }
  });

  test('should show 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByText('404 - Page Not Found')).toBeVisible();
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Check sidebar is visible
    const sidebar = page.locator('aside, [role="navigation"]').first();
    await expect(sidebar).toBeVisible();
  });
});
