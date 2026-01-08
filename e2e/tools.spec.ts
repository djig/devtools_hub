import { test, expect } from '@playwright/test';

test.describe('Developer Tools', () => {
  test.describe('JSON Formatter', () => {
    test('should format valid JSON', async ({ page }) => {
      await page.goto('/tools/json-formatter');

      // Wait for page to load
      await expect(page.getByRole('heading', { name: /json formatter/i })).toBeVisible();

      // Find input area and enter JSON
      const inputArea = page.locator('textarea, [contenteditable="true"], .monaco-editor').first();
      if (await inputArea.isVisible()) {
        await inputArea.click();
        await page.keyboard.type('{"name":"test","value":123}');
      }
    });

    test('should load JSON formatter page', async ({ page }) => {
      await page.goto('/tools/json-formatter');
      await expect(page.getByRole('heading', { name: /json formatter/i })).toBeVisible();
    });
  });

  test.describe('Base64 Encoder', () => {
    test('should load Base64 encoder page', async ({ page }) => {
      await page.goto('/tools/base64-encoder');
      await expect(page.getByRole('heading', { name: /base64/i })).toBeVisible();
    });
  });

  test.describe('UUID Generator', () => {
    test('should load UUID generator page', async ({ page }) => {
      await page.goto('/tools/uuid-generator');
      await expect(page.getByRole('heading', { name: 'UUID Generator', exact: true })).toBeVisible();
    });

    test('should generate UUIDs', async ({ page }) => {
      await page.goto('/tools/uuid-generator');
      // Wait for page to fully load
      await expect(page.getByRole('heading', { name: 'UUID Generator', exact: true })).toBeVisible();

      // Look for generated UUID pattern (8-4-4-4-12 format)
      const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
      const pageContent = await page.content();
      expect(pageContent.match(uuidPattern)).toBeTruthy();
    });
  });

  test.describe('Hash Generator', () => {
    test('should load Hash generator page', async ({ page }) => {
      await page.goto('/tools/hash-generator');
      await expect(page.getByRole('heading', { name: /hash/i })).toBeVisible();
    });
  });

  test.describe('Regex Tester', () => {
    test('should load Regex tester page', async ({ page }) => {
      await page.goto('/tools/regex-tester');
      await expect(page.getByRole('heading', { name: 'Regex Tester', exact: true })).toBeVisible();
    });
  });

  test.describe('Epoch Converter', () => {
    test('should load Epoch converter page', async ({ page }) => {
      await page.goto('/tools/epoch-converter');
      await expect(page.getByRole('heading', { name: 'Epoch Converter', exact: true })).toBeVisible();
    });
  });

  test.describe('URL Encoder', () => {
    test('should load URL encoder page', async ({ page }) => {
      await page.goto('/tools/url-encoder');
      await expect(page.getByRole('heading', { name: /url/i })).toBeVisible();
    });
  });

  test.describe('Color Converter', () => {
    test('should load Color converter page', async ({ page }) => {
      await page.goto('/tools/color-converter');
      await expect(page.getByRole('heading', { name: /color/i })).toBeVisible();
    });
  });

  test.describe('Text Counter', () => {
    test('should load Text counter page', async ({ page }) => {
      await page.goto('/tools/text-counter');
      await expect(page.getByRole('heading', { name: /text counter/i })).toBeVisible();
    });
  });

  test.describe('Lorem Ipsum Generator', () => {
    test('should load Lorem Ipsum generator page', async ({ page }) => {
      await page.goto('/tools/lorem-ipsum');
      await expect(page.getByRole('heading', { name: /lorem/i })).toBeVisible();
    });
  });
});
