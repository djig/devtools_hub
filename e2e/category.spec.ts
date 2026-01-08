import { test, expect } from '@playwright/test';

test.describe('Category Pages', () => {
  test('should display formatters category page', async ({ page }) => {
    await page.goto('/category/formatters');

    // Check category heading
    await expect(page.getByRole('heading', { name: /formatters/i })).toBeVisible();

    // Check that tools are displayed
    await expect(page.getByText(/json formatter/i)).toBeVisible();
  });

  test('should display converters category page', async ({ page }) => {
    await page.goto('/category/converters');

    // Check category heading
    await expect(page.getByRole('heading', { name: /converters/i })).toBeVisible();

    // Check that tools are displayed
    await expect(page.getByText(/json.*yaml/i).first()).toBeVisible();
  });

  test('should display encoders category page', async ({ page }) => {
    await page.goto('/category/encoders');

    // Check category heading
    await expect(page.getByRole('heading', { name: /encoders|decoders/i })).toBeVisible();
  });

  test('should display text tools category page', async ({ page }) => {
    await page.goto('/category/text');

    // Check category heading - use more specific pattern
    await expect(page.getByRole('heading', { name: 'Text Tools' })).toBeVisible();
  });

  test('should display generators category page', async ({ page }) => {
    await page.goto('/category/generators');

    // Check category heading
    await expect(page.getByRole('heading', { name: 'Generators' })).toBeVisible();
  });

  test('should display datetime category page', async ({ page }) => {
    await page.goto('/category/datetime');

    // Check category heading - use exact match
    await expect(page.getByRole('heading', { name: 'Date & Time' })).toBeVisible();
  });

  test('should display calculators category page', async ({ page }) => {
    await page.goto('/category/calculators');

    // Check category heading
    await expect(page.getByRole('heading', { name: /calculators/i })).toBeVisible();
  });

  test('should display developer tools category page', async ({ page }) => {
    await page.goto('/category/developer');

    // Check category heading
    await expect(page.getByRole('heading', { name: /developer/i })).toBeVisible();
  });

  test('should display network category page', async ({ page }) => {
    await page.goto('/category/network');

    // Check category heading
    await expect(page.getByRole('heading', { name: /network|security/i })).toBeVisible();
  });

  test('should navigate from category to tool', async ({ page }) => {
    await page.goto('/category/formatters');

    // Click on JSON Formatter
    await page.getByText(/json formatter/i).first().click();

    // Should navigate to the tool page
    await expect(page).toHaveURL(/\/tools\/json-formatter/);
  });
});
