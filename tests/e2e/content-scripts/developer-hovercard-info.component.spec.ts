import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: developer hovercard info', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-hovercard-');
    context = launched.context;
    userDataDir = launched.userDataDir;

    await context.route('https://oss.open-digger.cn/github/wxharry/openrank.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          '2026-01': '123.45',
          '2026-02': '234.56',
        }),
      });
    });
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('injects OpenRank info into GitHub developer hovercard', async () => {
    const page = await context.newPage();
    try {
      await gotoPublicRepo(page);
      const hoverAnchor = page.locator('[data-hovercard-url="/users/wxharry/hovercard"]').first();
      await expect(hoverAnchor).toBeVisible();

      await hoverAnchor.hover();
      await expect(page.locator('.hypercrx-openrank-info')).toBeVisible({ timeout: 15000 });
    } finally {
      await page.close();
    }
  });

  test('rendered OpenRank block carries developer identity metadata', async () => {
    const page = await context.newPage();
    try {
      await gotoPublicRepo(page);
      const hoverAnchor = page.locator('[data-hovercard-url="/users/wxharry/hovercard"]').first();
      await hoverAnchor.hover();

      const info = page.locator('.hypercrx-openrank-info').first();
      await expect(info).toBeVisible({ timeout: 15000 });
      await expect(info).toHaveAttribute('data-developer-name', 'wxharry');
    } finally {
      await page.close();
    }
  });
});
