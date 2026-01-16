import { test, expect, chromium, BrowserContext } from '@playwright/test';
import path from 'path';

let context: BrowserContext;

test.beforeAll(async () => {
  const pathToExtension = path.resolve(__dirname, '../dist');

  context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
});

test.afterAll(async () => {
  await context?.close();
});

test.describe('DevTools Hub Chrome Extension', () => {
  test('extension popup opens', async () => {
    // Wait for service worker and get extension ID
    const serviceWorker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const extensionId = serviceWorker.url().split('/')[2];

    // Open popup
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);

    // Verify popup content
    await expect(popup.locator('text=DevTools Hub')).toBeVisible();
    await expect(popup.locator('text=Formatters')).toBeVisible();
    await expect(popup.locator('text=Converters')).toBeVisible();
    await expect(popup.locator('text=Encoders')).toBeVisible();
    await expect(popup.locator('text=Generators')).toBeVisible();
    await expect(popup.locator('text=Text')).toBeVisible();
  });

  test('can format JSON in popup', async () => {
    const serviceWorker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const extensionId = serviceWorker.url().split('/')[2];

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);

    // Click on Formatters category (should be open by default)
    await expect(popup.locator('text=Format JSON')).toBeVisible();

    // Click Format JSON tool
    await popup.click('text=Format JSON');

    // Enter JSON
    await popup.fill('textarea', '{"name":"test","value":123}');

    // Execute
    await popup.click('text=Execute');

    // Verify formatted output
    await expect(popup.locator('pre')).toContainText('"name"');
    await expect(popup.locator('pre')).toContainText('"test"');
  });

  test('can generate UUID in popup', async () => {
    const serviceWorker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const extensionId = serviceWorker.url().split('/')[2];

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);

    // Click on Generators category
    await popup.click('text=Generators');

    // Click Generate UUID
    await popup.click('text=Generate UUID');

    // Verify UUID is generated (UUID v4 format)
    await expect(popup.locator('pre')).toHaveText(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  });
});
