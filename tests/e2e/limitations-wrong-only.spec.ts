import { test, expect } from '@playwright/test';

test('limitations wrong-only rebuilds a fresh session from saved items', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rr_active_model_variant', 'AW169');
    localStorage.setItem('rr_progress_last_wrong:AW169:limitations', JSON.stringify({
      section: 'limitations',
      createdAt: '2024-01-01T00:00:00.000Z',
      items: [{
        id: 'lim-test-1',
        section: 'limitations',
        type: 'single',
        question: 'What is the limitation test question?',
        options: ['A', 'B'],
        answer: [1],
      }],
      answers: [1],
      flags: [true],
    }));
  });

  await page.goto('/limitations-quiz');

  const wrongOnlyCard = page.locator('div.rounded-xl').filter({ hasText: 'Practice wrong answers only' });
  await wrongOnlyCard.getByRole('button', { name: /^start$/i }).click();

  await expect(page).toHaveURL(/\/limitations-quiz\/1$/);

  const session = await page.evaluate(() => JSON.parse(sessionStorage.getItem('limq_session') || 'null'));

  expect(session?.section).toBe('limitations');
  expect(session?.items).toHaveLength(1);
  expect(session?.items[0]?.id).toBe('lim-test-1');
  expect(session?.answers).toEqual([null]);
  expect(session?.flags).toEqual([false]);
  expect(session?.createdAt).not.toBe('2024-01-01T00:00:00.000Z');
});