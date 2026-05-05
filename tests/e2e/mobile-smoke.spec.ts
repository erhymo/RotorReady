import { expect, test } from '@playwright/test';

function overlaps(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
  });
});

test('home mobile header actions stay inside the header and away from content', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'RotorReady' })).toBeVisible();
	  await expect(page.locator('span[title="In production"]:visible')).toBeVisible();
	  await expect(page.locator('a[href="/info"]:visible')).toBeVisible();

  const header = await page.locator('.rr-safe-top').boundingBox();
	  const prod = await page.locator('span[title="In production"]:visible').boundingBox();
	  const info = await page.locator('a[href="/info"]:visible').boundingBox();
  const title = await page.getByRole('heading', { name: 'RotorReady' }).boundingBox();
  const model = await page.locator('a[href="/account"]').first().boundingBox();

  expect(header).not.toBeNull();
  expect(prod).not.toBeNull();
  expect(info).not.toBeNull();
  expect(title).not.toBeNull();
  expect(model).not.toBeNull();

  expect(prod!.y).toBeGreaterThanOrEqual(header!.y);
  expect(prod!.y + prod!.height).toBeLessThanOrEqual(header!.y + header!.height + 1);
  expect(info!.y).toBeGreaterThanOrEqual(header!.y);
  expect(info!.y + info!.height).toBeLessThanOrEqual(header!.y + header!.height + 1);
  expect(overlaps(prod!, title!)).toBe(false);
  expect(overlaps(info!, title!)).toBe(false);
  expect(overlaps(prod!, model!)).toBe(false);
  expect(overlaps(info!, model!)).toBe(false);

  await expectNoHorizontalOverflow(page);
});

test('core app pages load on mobile', async ({ page }) => {
  const pages = [
    { path: '/', heading: 'RotorReady' },
    { path: '/account', heading: 'Settings' },
    { path: '/offline', heading: 'Offline packages' },
    { path: '/weather', heading: 'Weather planning' },
    { path: '/airports', heading: 'Airports' },
  ];

  for (const entry of pages) {
    await page.goto(entry.path);
    await expect(page.getByRole('heading', { name: entry.heading }).first()).toBeVisible({ timeout: 15_000 });
    await expectNoHorizontalOverflow(page);
  }
});

test('limitations quiz question can be answered and finished on mobile', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('limq_session', JSON.stringify({
      section: 'limitations',
      createdAt: '2024-01-01T00:00:00.000Z',
      items: [{
        id: 'mobile-smoke-limitation-1',
        section: 'limitations',
        type: 'single',
        question: 'Mobile smoke limitation question?',
        options: ['Correct option', 'Incorrect option'],
        answer: [0],
      }],
      answers: [null],
      flags: [false],
      amountToken: '1',
    }));
  });

  await page.goto('/limitations-quiz/1');
  await expect(page.getByText('Question 1 / 1').first()).toBeVisible();
	  await page.getByRole('button', { name: /^1\.Correct option$/i }).click();
  await expect(page.getByText('Correct ✅')).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/limitations-quiz\/result$/, { timeout: 15_000 }),
    page.getByRole('button', { name: /finish/i }).click(),
  ]);

  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible();
  await expect(page.getByText('Percent:')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});