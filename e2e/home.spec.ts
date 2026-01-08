import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage with hero section', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('Developer Tools Hub');

    // Check the tagline
    await expect(page.getByText('47+ Tools, All Free & Private')).toBeVisible();

    // Check the description
    await expect(
      page.getByText('A stunning collection of developer utilities that run entirely in your browser')
    ).toBeVisible();
  });

  test('should display all category cards', async ({ page }) => {
    // All 9 categories should be visible - check using text content
    const categories = [
      'Formatters & Validators',
      'Converters',
      'Encoders/Decoders',
      'Text Tools',
      'Generators',
      'Date & Time',
      'Calculators',
      'Developer Tools',
      'Network & Security',
    ];

    for (const category of categories) {
      await expect(page.getByText(category, { exact: true }).first()).toBeVisible();
    }
  });

  test('should display stats section', async ({ page }) => {
    await expect(page.getByText('47+').first()).toBeVisible();
    await expect(page.getByText('100%')).toBeVisible();
    await expect(page.getByText('0ms')).toBeVisible();
    await expect(page.getByText('Developer Tools').first()).toBeVisible();
    await expect(page.getByText('Private & Secure')).toBeVisible();
    await expect(page.getByText('Server Latency')).toBeVisible();
  });

  test('should navigate to category page when clicking category card', async ({ page }) => {
    await page.getByRole('heading', { name: 'Formatters & Validators' }).click();
    await expect(page).toHaveURL(/\/category\/formatters/);
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Developer Tools/);
  });
});
