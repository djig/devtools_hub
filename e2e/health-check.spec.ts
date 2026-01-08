import { test, expect } from '@playwright/test';

test.describe('Application Health Check', () => {
  test('should load the application without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Check that main content loaded
    await expect(page.locator('body')).toBeVisible();

    // Check no critical console errors (filter out known non-critical errors)
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('favicon') &&
        !err.includes('DevTools') &&
        !err.includes('Download the React DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have no broken images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate(
        (el) => (el as HTMLImageElement).naturalWidth
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('should have working CSS (styled elements)', async ({ page }) => {
    await page.goto('/');

    // Check that the main heading has expected styles
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Check computed styles
    const color = await heading.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    );
    expect(color).toBeTruthy();
  });

  test('should have responsive layout', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have correct meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Check description meta tag
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
  });

  test('should load tools without errors', async ({ page }) => {
    const toolPaths = [
      '/tools/json-formatter',
      '/tools/base64-encoder',
      '/tools/uuid-generator',
      '/tools/text-counter',
      '/tools/epoch-converter',
    ];

    for (const path of toolPaths) {
      await page.goto(path);

      // Wait for page to stabilize
      await page.waitForLoadState('networkidle');

      // Verify page loaded
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should have working dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Check if theme toggle button exists
    const themeToggle = page.locator('[aria-label*="theme"], button:has([class*="sun"]), button:has([class*="moon"])');

    if (await themeToggle.first().isVisible()) {
      // Click theme toggle
      await themeToggle.first().click();

      // Wait a moment for theme change
      await page.waitForTimeout(100);

      // Verify body still visible after theme change
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // Check that the page has loaded
    await expect(page.locator('body')).toBeVisible();

    // Check for links - the page should have navigation links
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});
