import { test, expect } from '@playwright/test';

test('admin APIs return fallback payloads instead of 500 when Firebase Admin is unavailable', async ({ request }) => {
  const subscriptionsRes = await request.get('/api/admin/subscriptions');
  expect(subscriptionsRes.status()).toBe(200);
  const subscriptions = await subscriptionsRes.json();
  expect(subscriptions.metrics).toBeTruthy();
  expect(subscriptions.metrics.totalUsers).toBe(0);
  expect(subscriptions.devWarning ?? subscriptions.error).toBeTruthy();

  const trafficRes = await request.get('/api/admin/traffic');
  expect(trafficRes.status()).toBe(200);
  const traffic = await trafficRes.json();
  expect(traffic.metrics).toEqual({
    totalTrackedUsers: 0,
    last1Day: { appOpens: 0, uniqueVisitors: 0 },
    last7Days: { appOpens: 0, uniqueVisitors: 0 },
    last30Days: { appOpens: 0, uniqueVisitors: 0 },
    activeLast7Days: 0,
    activeLast30Days: 0,
    activeToday: 0,
  });
  expect(traffic.devWarning ?? traffic.error).toBeTruthy();

  const usersRes = await request.get('/api/admin/users');
  expect(usersRes.status()).toBe(200);
  const users = await usersRes.json();
  expect(users.users).toEqual([]);
  expect(users.devWarning ?? users.error).toBeTruthy();
});

test('admin page renders subscriptions and traffic warnings instead of failing', async ({ page }) => {
  await page.goto('/admin');

  await expect(page.getByRole('heading', { name: 'Subscriptions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Traffic' })).toBeVisible();
  await expect(page.getByText(/viser tom abonnementsoversikt/i)).toBeVisible();
  await expect(page.getByText(/viser tom trafikkoversikt/i)).toBeVisible();
});