import { test, expect } from '@playwright/test';

const CASES = [
  {
    name: 'emergency quiz starts from downloaded offline section data',
    path: '/emergency-quiz',
    heading: 'Emergency Procedures Quiz',
    sessionKey: 'emergq_session',
    offlineSectionId: 'emergency_procedures',
    question: 'Emergency offline question?',
  },
  {
    name: 'engine systems quiz starts from downloaded offline section data',
    path: '/engine-systems-quiz',
    heading: 'Engine, Fuel, Lubricants, Hydraulics & System Limitations',
    sessionKey: 'engineq_session',
    offlineSectionId: 'engine-systems',
    question: 'Engine offline question?',
  },
  {
    name: 'avionics quiz starts from downloaded offline section data',
    path: '/avionics-fms-limitations-quiz',
    heading: 'Avionics & FMS Limitations',
    sessionKey: 'avionics_session',
    offlineSectionId: 'avionics_fms_limitations',
    question: 'Avionics offline question?',
  },
] as const;

for (const scenario of CASES) {
  test(scenario.name, async ({ page }) => {
    const offlineStorageKey = `offline:sections:AW169:${scenario.offlineSectionId}`;
    const item = {
      id: `${scenario.offlineSectionId}-offline-1`,
      section: scenario.offlineSectionId,
      type: 'single',
      question: scenario.question,
      options: ['A', 'B'],
      answer: [1],
    };

    await page.addInitScript(({ offlineStorageKey, offlineSectionId, item }) => {
      localStorage.setItem('rr_active_model_variant', 'AW169');
      localStorage.setItem('rr_e2e_logged_in', '1');
      localStorage.setItem(offlineStorageKey, JSON.stringify({
        type: 'section',
        id: offlineSectionId,
        payload: { items: [item] },
        savedAt: '2024-01-01T00:00:00.000Z',
      }));
    }, { offlineStorageKey, offlineSectionId: scenario.offlineSectionId, item });

    await page.route('**/model-data/**', (route) => route.abort());
    await page.route('**/quiz-data/**', (route) => route.abort());
    await page.route('**/api/blocked-questions', (route) => route.abort());

    await page.goto(scenario.path);

    await expect(page.getByRole('heading', { name: scenario.heading })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('1 total')).toBeVisible({ timeout: 15000 });

    await expect(async () => {
      await page.getByRole('button', { name: /^start quiz$/i }).first().click();
      await expect.poll(() => page.evaluate(() => window.location.pathname)).toBe(`${scenario.path}/1`);
    }).toPass({ timeout: 15000 });

    await expect(page.getByText('Question 1 / 1').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(scenario.question)).toBeVisible({ timeout: 15000 });

    const session = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key) || 'null'), scenario.sessionKey);

    expect(session?.items?.map((entry: { id: string }) => entry.id)).toEqual([item.id]);
  });
}