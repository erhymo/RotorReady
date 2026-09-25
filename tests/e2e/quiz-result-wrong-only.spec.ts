import { test, expect } from '@playwright/test';

// Every section runs through /quiz/<section>/play since the per-section quiz
// copies (/limitations-quiz and friends) were retired. These cover what each
// of those had its own test for: the result page records progress, keeps the
// wrong-answer set and history, and restarts from only the missed questions.
const SECTIONS = ['limitations', 'emergency_procedures', 'engine-systems', 'avionics_fms_limitations', 'normal_procedures'];

for (const section of SECTIONS) {
  test(`${section}: result page persists wrong-only set and restarts from missed items`, async ({ page }) => {
    const sessionKey = `quiz_session:AW169:${section}`;
    await page.addInitScript(({ sessionKey, section }) => {
      localStorage.setItem('rr_active_model_variant', 'AW169');
      sessionStorage.setItem(sessionKey, JSON.stringify({
        section,
        createdAt: '2024-01-01T00:00:00.000Z',
        amountToken: 'all',
        items: [
          { id: `${section}-r1`, section, type: 'single', question: 'Already correct?', options: ['A', 'B'], answer: [1] },
          { id: `${section}-r2`, section, type: 'single', question: 'Should remain for wrong-only practice?', options: ['A', 'B'], answer: [1] },
        ],
        answers: [1, 0],
        flags: [true, true],
      }));
    }, { sessionKey, section });

    await page.goto(`/quiz/${section}/play/result`);

    await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Correct:').locator('..')).toContainText('1');

    const read = (key: string) => page.evaluate((k) => {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    }, key);

    await expect.poll(async () => (await read(`rr_progress_last_wrong:AW169:${section}`))?.items?.map((i: { id: string }) => i.id) ?? null)
      .toEqual([`${section}-r2`]);
    await expect.poll(async () => (await read(`rr_wrong_history:AW169:${section}`))?.at(-1)?.items?.map((i: { id: string }) => i.id) ?? null)
      .toEqual([`${section}-r2`]);
    await expect.poll(async () => (await read('rr_progress:AW169'))?.at(-1) ?? null)
      .toMatchObject({ section, total: 2, correct: 1, percent: 50 });

    await expect(async () => {
      await page.getByRole('button', { name: 'Practice wrong answers' }).click();
      await expect(page).toHaveURL(new RegExp(`/quiz/${section}/play/q\\?n=1$`), { timeout: 5000 });
    }).toPass({ timeout: 15000 });

    await expect(page.getByText('Question 1 / 1').first()).toBeVisible();
    await expect(page.getByText('Should remain for wrong-only practice?')).toBeVisible();

    const session = await page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) || 'null'), sessionKey);
    expect(session?.items?.map((i: { id: string }) => i.id)).toEqual([`${section}-r2`]);
    expect(session?.answers).toEqual([null]);
    expect(session?.flags).toEqual([false]);
  });
}

test('result page for a non-default aircraft reads its own session', async ({ page }) => {
  // The session key includes the model id; the first render still has the
  // default model, so reading too early would bounce an S-92 pilot back.
  await page.addInitScript(() => {
    localStorage.setItem('rr_active_model_variant', 'S92');
    sessionStorage.setItem('quiz_session:S92:limitations', JSON.stringify({
      section: 'limitations', createdAt: '2024-01-01T00:00:00.000Z', amountToken: 'all',
      items: [{ id: 's92-x', section: 'limitations', type: 'single', question: 'Q?', options: ['A', 'B'], answer: [0] }],
      answers: [0], flags: [false],
    }));
  });
  await page.goto('/quiz/limitations/play/result');
  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Percent:').locator('..')).toContainText('100%');
});
