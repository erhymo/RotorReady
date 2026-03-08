import { test, expect } from '@playwright/test';

const WRONG_SET_KEY = 'rr_progress_last_wrong:AW169:normal_procedures';
const HISTORY_KEY = 'rr_wrong_history:AW169:normal_procedures';
const OVERRIDE_KEY = 'quiz_session_override:AW169:normal_procedures';
const RESUME_KEY = 'quiz:resume:AW169:normal_procedures:all';

const WRONG_SET = {
  section: 'normal_procedures',
  createdAt: '2024-01-01T00:00:00.000Z',
  items: [
    {
      id: 'np-wrong-1',
      section: 'normal_procedures',
      type: 'single',
      question: 'Seeded wrong-only question 1?',
      options: ['Alpha', 'Bravo'],
      answer: [1],
    },
    {
      id: 'np-wrong-2',
      section: 'normal_procedures',
      type: 'single',
      question: 'Seeded wrong-only question 2?',
      options: ['Charlie', 'Delta'],
      answer: [0],
    },
  ],
};

test('generic wrong-only uses saved wrong-set and clears override session after load', async ({ page }) => {
  await page.addInitScript(({ key, wrongSet }) => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem(key, JSON.stringify(wrongSet));
  }, { key: WRONG_SET_KEY, wrongSet: WRONG_SET });

  await page.goto('/quiz/normal_procedures');

  const wrongOnlyCard = page.locator('div.rounded-xl')
    .filter({ has: page.getByText('Practice wrong answers only', { exact: true }) })
    .filter({ has: page.getByText('Reuse the last wrong-answer set for focused practice.', { exact: true }) });
  await expect(wrongOnlyCard).toBeVisible();
  await expect(async () => {
    await wrongOnlyCard.getByRole('button', { name: /^start$/i }).click();
    await expect(page).toHaveURL(/\/quiz\/normal_procedures\/all$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });
  await expect(page.getByText(/Seeded wrong-only question [12]\?/)).toBeVisible();
  await expect(page.getByText('Question 1 / 2').first()).toBeVisible();

  const overrideValue = await page.evaluate((key) => sessionStorage.getItem(key), OVERRIDE_KEY);
  expect(overrideValue).toBeNull();

  const resumeSnapshot = await page.evaluate(() => {
    const raw = localStorage.getItem('quiz:resume:AW169:normal_procedures:all');
    return raw ? JSON.parse(raw) : null;
  });

  expect(resumeSnapshot?.items).toHaveLength(2);
  expect(resumeSnapshot?.items.map((item: { id: string }) => item.id).sort()).toEqual(['np-wrong-1', 'np-wrong-2']);
});

test('generic wrong-only prefers rr_wrong_history over last-wrong fallback', async ({ page }) => {
  await page.addInitScript(({ historyKey, fallbackKey }) => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem(historyKey, JSON.stringify([
      {
        createdAt: '2024-01-01T00:00:00.000Z',
        items: [{ id: 'hist-1', section: 'normal_procedures', type: 'single', question: 'History item wins', options: ['A', 'B'], answer: [0] }],
      },
    ]));
    localStorage.setItem(fallbackKey, JSON.stringify({
      section: 'normal_procedures',
      createdAt: '2024-01-02T00:00:00.000Z',
      items: [
        { id: 'fallback-1', section: 'normal_procedures', type: 'single', question: 'Fallback item should be ignored', options: ['X', 'Y'], answer: [1] },
      ],
    }));
  }, { historyKey: HISTORY_KEY, fallbackKey: WRONG_SET_KEY });

  await page.goto('/quiz/normal_procedures');

  const wrongOnlyCard = page.locator('div.rounded-xl')
    .filter({ has: page.getByText('Practice wrong answers only', { exact: true }) })
    .filter({ has: page.getByText('Reuse the last wrong-answer set for focused practice.', { exact: true }) });
  await expect(wrongOnlyCard).toBeVisible();
  await expect(async () => {
    await wrongOnlyCard.getByRole('button', { name: /^start$/i }).click();
    await expect(page).toHaveURL(/\/quiz\/normal_procedures\/all$/, { timeout: 5000 });
  }).toPass({ timeout: 15000 });
  await expect(page.getByText('Question 1 / 1').first()).toBeVisible();
  await expect(page.getByText('History item wins')).toBeVisible();
  await expect(page.getByText('Fallback item should be ignored')).toHaveCount(0);

  const resumeSnapshot = await page.evaluate(() => {
    const raw = localStorage.getItem('quiz:resume:AW169:normal_procedures:all');
    return raw ? JSON.parse(raw) : null;
  });

  expect(resumeSnapshot?.items).toHaveLength(1);
  expect(resumeSnapshot?.items[0]?.id).toBe('hist-1');
  expect(resumeSnapshot?.items[0]?.question).toBe('History item wins');
});

test('generic runtime prefers resume snapshot over override session', async ({ page }) => {
  await page.addInitScript(({ resumeKey, overrideKey }) => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem(resumeKey, JSON.stringify({
      section: 'normal_procedures',
      variantId: 'AW169',
      amount: 'all',
      idx: 1,
      items: [
        { id: 'resume-1', section: 'normal_procedures', type: 'single', question: 'Resume question 1', options: ['A', 'B'], answer: [1] },
        { id: 'resume-2', section: 'normal_procedures', type: 'single', question: 'Resume question 2 wins', options: ['C', 'D'], answer: [0] },
      ],
      answers: [1, null],
      flags: [true, false],
      startedAt: Date.now(),
      updatedAt: Date.now(),
    }));
    sessionStorage.setItem(overrideKey, JSON.stringify({
      items: [
        { id: 'override-1', section: 'normal_procedures', type: 'single', question: 'Override question should be ignored', options: ['X', 'Y'], answer: [0] },
      ],
    }));
  }, { resumeKey: RESUME_KEY, overrideKey: OVERRIDE_KEY });

  await page.goto('/quiz/normal_procedures/all');

  await expect(page.getByText('Question 2 / 2').first()).toBeVisible();
  await expect(page.getByText('Resume question 2 wins')).toBeVisible();
  await expect(page.getByText('Override question should be ignored')).toHaveCount(0);

  await page.getByRole('button', { name: /^previous$/i }).click();
  await expect(page.getByText('Question 1 / 2').first()).toBeVisible();
  await expect(page.getByText('Resume question 1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove flag' })).toBeVisible();

  const overrideValue = await page.evaluate((key) => sessionStorage.getItem(key), OVERRIDE_KEY);
  expect(overrideValue).not.toBeNull();
  expect(JSON.parse(overrideValue || '{}')?.items?.[0]?.id).toBe('override-1');
});