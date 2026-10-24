// Traduccions dels taulers: CA base, VA només diferències, ES i EN.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const COMMONS = 'https://commons.edutictac.es';
const API = 'https://recursos.edutictac.es/api';
const ASSETS = process.env.COMMONS_ASSETS || path.join(__dirname, '../../edutictac-commons/services/portal/public/assets');
const HAS_WIDGET = fs.existsSync(path.join(ASSETS, 'account-widget.js'));

const summary = {
  total: 3,
  active: 2,
  groups: [{ id: 'g1', name: 'Grup A', active: 2, total: 3, created_at: '2026-10-20T10:00:00Z', tenant_id: 'centre' }],
};
const assignment = { id: 'a1', app_id: 'h5p', activity_id: 'taula-2', title: 'Taula del 2', group_id: 'g1' };
const anonymous = { authenticated: false, kind: 'anonymous', role: null, display_name: null, public_code: null, login_available: true,
  links: { login: '/api/auth/oidc/login?next=x', teacher: '/teacher.html', student: '/student.html', account: null, logout: '/api/auth/session/logout' } };

async function commons(page, mode = 'down') {
  await page.route(`${COMMONS}/**`, route => {
    if (mode === 'down') return route.abort();
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/assets/')) return route.fulfill({ path: path.join(ASSETS, path.basename(url.pathname)) });
    if (url.pathname === '/api/auth/session') return route.fulfill({ json: anonymous });
    return route.fulfill({ status: 404, body: '' });
  });
}

async function api(page) {
  await page.route(`${API}/**`, async route => {
    const request = route.request();
    const cors = {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:18640',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const url = new URL(request.url());
    const p = url.pathname;
    const respond = json => route.fulfill({ status: 200, headers: cors, json });
    if (p === '/api/auth/me') return respond({ logged_in: true });
    if (p === '/api/teacher/student-summary') return respond(summary);
    if (p === '/api/teacher/student-identities') return respond({ identities: [{ id: 'i1', public_code: 'K7P', tenant_id: 'centre' }] });
    if (p === '/api/teacher/activity-assignments' && request.method() === 'POST') return respond({ ok: true });
    if (p === '/api/teacher/activity-assignments') return respond({ assignments: [assignment] });
    if (p === '/api/teacher/activity-assignments/a1/results') return respond({
      assignment,
      results: [{ public_code: 'K7P', attempts: 2, best_score: 80, last_score_at: '2026-10-20T10:00:00Z' }],
    });
    if (p === '/api/teacher/student-batches') return respond({ credentials: [{ code: 'K7P', pin: '1234' }, { code: 'M2Q', pin: '5678' }] });
    if (p.endsWith('/regenerate-pin')) return respond({ pin: '9999' });
    if (p === '/api/teacher/student-identities/by-code/K7P') return respond({ identity: { id: 'i1', public_code: 'K7P' } });
    return route.fulfill({ status: 404, headers: cors, json: { detail: 'not found' } });
  });
}

async function waitFallback(page) {
  await expect(page.locator('.tauler-fallback')).toBeVisible({ timeout: 8000 });
}

test.describe('tauler de l’alumnat', () => {
  for (const [lang, title, recent, today] of [
    ['ca', "Tauler de l'alumnat", 'Activitat recent', 'Avui'],
    ['va', "Tauler de l'alumnat", 'Activitat recent', 'Hui'],
    ['es', 'Panel del alumnado', 'Actividad reciente', 'Hoy'],
    ['en', 'Student dashboard', 'Recent activity', 'Today'],
  ]) {
    test(`${lang}: textos estàtics i galeta`, async ({ page, context }) => {
      await commons(page, 'down');
      await page.goto('/tauler-alumnat.html');
      await waitFallback(page);
      await page.locator(`.tauler-fallback [data-lang="${lang}"]`).click();
      await expect(page.locator('h1')).toHaveText(title);
      await expect(page.locator('h2', { hasText: recent }).first()).toBeVisible();
      await expect(page.locator('h2', { hasText: today }).first()).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'va' ? 'ca-ES-valencia' : lang);
      expect((await context.cookies()).find(cookie => cookie.name === 'edutictac_language')?.value).toBe(lang);
    });
  }

  test('?lang= guanya la galeta i tradueix també el títol', async ({ page, context }) => {
    await context.addCookies([{ name: 'edutictac_language', value: 'ca', url: 'http://127.0.0.1:18640' }]);
    await commons(page, 'down');
    await page.goto('/tauler-alumnat.html?lang=en');
    await waitFallback(page);
    await expect(page.locator('h1')).toHaveText('Student dashboard');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle('Student dashboard — EduTicTac Commons');
  });

  test('CA i VA comparteixen base i només canvien les formes valencianes', async ({ page }) => {
    await commons(page, 'down');
    await page.goto('/tauler-alumnat.html');
    await waitFallback(page);
    await page.locator('.tauler-fallback [data-lang="ca"]').click();
    await expect(page.getByText('Entra a la teva aula')).toBeVisible();
    await expect(page.getByText('Avui', { exact: true })).toBeVisible();
    await page.locator('.tauler-fallback [data-lang="va"]').click();
    await expect(page.getByText('Entra a la teua aula')).toBeVisible();
    await expect(page.getByText('Hui', { exact: true })).toBeVisible();
  });

  test('el xip de Commons oferix CA/VA/ES/EN i canvia la pàgina', async ({ page }) => {
    test.skip(!HAS_WIDGET, 'cal COMMONS_ASSETS amb el xip');
    await commons(page, 'up');
    await page.goto('/tauler-alumnat.html');
    const widget = page.locator('edutictac-account');
    await expect(widget.locator('.eta-home')).toBeVisible();
    await widget.locator('summary').click();
    await expect(widget.locator('[data-lang-option]')).toHaveText(['CA', 'VA', 'ES', 'EN']);
    await widget.locator('[data-lang-option="en"]').click();
    await expect(page.locator('h1')).toHaveText('Student dashboard');
    await expect(page.locator('.tauler-fallback')).toBeHidden();
  });
});


test('un navegador ca-ES usa català central, no valencià', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'ca-ES' });
  const page = await context.newPage();
  await commons(page, 'down');
  await page.goto('/tauler-alumnat.html');
  await waitFallback(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.getByText('Entra a la teva aula')).toBeVisible();
  await expect(page.getByText('Avui', { exact: true })).toBeVisible();
  await context.close();
});


test('el valencià dinàmic només canvia les formes valencianes', async ({ page, context }) => {
  await context.addCookies([{ name: 'edutictac_language', value: 'va', url: 'http://127.0.0.1:18640' }]);
  await page.addInitScript(() => {
    sessionStorage.setItem('edutictac-teacher-visible-credentials', JSON.stringify([{ code: 'OLD1', pin: '1111' }]));
  });
  await commons(page, 'down');
  await api(page);
  await page.goto('/tauler-professorat.html');
  await waitFallback(page);
  expect(await page.evaluate(() => TaulersI18n.t('teacher.feedback.recovered', { count: 1 }))).toContain("d'esta pestanya");
  await expect(page.locator('#toggleCredentialsBtn')).toHaveText('Ocultar');
  await page.locator('.tauler-fallback [data-lang="ca"]').click();
  expect(await page.evaluate(() => TaulersI18n.t('teacher.feedback.recovered', { count: 1 }))).toContain("d'aquesta pestanya");
  await expect(page.locator('#toggleCredentialsBtn')).toHaveText('Amaga');
  await expect(page.locator('#credentialsBody')).toContainText('OLD1');
});

test.describe('tauler del professorat', () => {
  test('missatges dinàmics, taula i canvi d’idioma sense recarregar', async ({ page }) => {
    await commons(page, 'down');
    await api(page);
    await page.goto('/tauler-professorat.html');
    await waitFallback(page);
    await page.locator('.tauler-fallback [data-lang="va"]').click();
    await expect(page.locator('#batchList')).toContainText('2 active');
    await expect(page.locator('#assignment-group')).toContainText('Grup A · 2 active');
    await page.locator('#generateStudentsBtn').click();
    await expect(page.locator('#batchFeedback')).toContainText('generades correctament');
    await expect(page.locator('#credentialsBody')).toContainText('K7P');
    await page.locator('.tauler-fallback [data-lang="en"]').click();
    await expect(page.locator('#batchFeedback')).toContainText('generated successfully');
    await expect(page.locator('#batchFeedback')).toContainText('The visible list contains 2 credentials');
    await expect(page.locator('#credentialsBody')).toContainText('K7P');
    await expect(page.locator('#credentialsBody')).toContainText('1234');
    await expect(page.locator('#credentialsBody')).toContainText('Resource bank and Commons services');
    await expect(page.locator('#credentialsBody')).toContainText('Created');
    await expect(page.locator('#toggleCredentialsBtn')).toHaveText('Hide');
    await expect(page.locator('#studentBatchForm')).toBeVisible();
  });

  test('resultats i errors es tradueixen en tornar a canviar', async ({ page }) => {
    await commons(page, 'down');
    await api(page);
    await page.goto('/tauler-professorat.html');
    await waitFallback(page);
    await expect(page.locator('#assignmentList button')).toBeVisible();
    await page.locator('#assignmentList button').click();
    await expect(page.locator('#assignmentResultsBody')).toContainText('K7P');
    await page.locator('.tauler-fallback [data-lang="es"]').click();
    await expect(page.locator('#assignmentResultsBody')).toContainText('K7P');
    await expect(page.locator('#assignmentResultsMeta')).toContainText('códigos con resultado');
    await expect(page.locator('#assignmentResultsBody')).toContainText('80');
  });

  test('la impressió usa l’idioma actiu', async ({ page }) => {
    await commons(page, 'down');
    await api(page);
    await page.goto('/tauler-professorat.html');
    await waitFallback(page);
    await page.locator('.tauler-fallback [data-lang="en"]').click();
    await page.locator('#generateStudentsBtn').click();
    await expect(page.locator('#credentialsBody')).toContainText('K7P');
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#printStudentsBtn').click();
    const popup = await popupPromise;
    await expect(popup.locator('h1')).toHaveText('EduTicTac Commons · student credentials');
    await expect(popup.locator('body')).toContainText('PIN 1234');
  });
});
