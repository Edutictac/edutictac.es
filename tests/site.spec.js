// Xip de compte de Commons, alternativa local i contracte d'idioma/tema.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const COMMONS = 'https://commons.edutictac.es';
const ASSETS = process.env.COMMONS_ASSETS || path.join(__dirname, '../../edutictac-commons/services/portal/public/assets');
const HAS_WIDGET = fs.existsSync(path.join(ASSETS, 'account-widget.js'));
const PAGES = ['index', 'commons', 'privacitat', 'instala-commons', 'edutictac-link', 'correu-classic', 'spike', 'tauler-professorat', 'tauler-alumnat'];
const WITH_I18N = PAGES.filter(name => !name.startsWith('tauler'));

const anonymous = { authenticated: false, kind: 'anonymous', role: null, display_name: null, public_code: null, login_available: true,
  links: { login: '/api/auth/oidc/login?next=x', teacher: '/teacher.html', student: '/student.html', account: null, logout: '/api/auth/session/logout' } };

async function commons(page, mode = 'up') {
  await page.route(`${COMMONS}/**`, route => {
    if (mode === 'down') return route.abort();
    if (mode === 'hang') return; // Commons no respon mai
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/assets/')) return route.fulfill({ path: path.join(ASSETS, path.basename(url.pathname)) });
    if (url.pathname === '/api/auth/session') {
      return route.fulfill({ json: anonymous, headers: { 'Access-Control-Allow-Origin': 'http://127.0.0.1:18640', 'Access-Control-Allow-Credentials': 'true' } });
    }
    return route.fulfill({ status: 404, body: '' });
  });
}

test.describe('amb Commons', () => {
  // Sense el xip, estes proves fallen (no se salten): un salt silenciós semblaria un èxit.
  // ALLOW_NO_COMMONS=1 les salta conscientment quan només es vol provar la web sense Commons.
  test.skip(!HAS_WIDGET && process.env.ALLOW_NO_COMMONS === '1', 'ALLOW_NO_COMMONS=1: proves del xip omeses');
  test.beforeEach(() => {
    if (!HAS_WIDGET) throw new Error(`No trobe account-widget.js en ${ASSETS}. Apunta COMMONS_ASSETS a un checkout de Commons amb el xip.`);
  });

  for (const name of PAGES) {
    test(`${name}: xip visible, sense <link> bloquejant ni dades fictícies`, async ({ page }) => {
      await commons(page);
      await page.goto(`/${name}.html`);
      await expect(page.locator('edutictac-account .eta-home')).toBeVisible();
      // En l'HTML servit no hi ha cap <link> a Commons; el CSS l'afig després l'script (no bloqueja).
      const html = await (await page.request.get(`/${name}.html`)).text();
      expect(html).not.toMatch(new RegExp(`<link[^>]+${COMMONS.replace(/\./g, '\\.')}`));
      await expect(page.locator(`link[href="${COMMONS}/assets/account-widget.css"]`)).toHaveCount(1);
      await expect(page.locator('.lang-switch')).toBeHidden();
      await expect(page.locator('body')).not.toContainText(/samuel@edutictac|A7K4Q|8291/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }

  test('l’idioma es tria en el xip i es comparteix amb la galeta', async ({ page, context }) => {
    await commons(page);
    await page.goto('/index.html');
    const widget = page.locator('edutictac-account');
    await widget.locator('summary').click();
    await expect(widget.locator('[data-lang-option]')).toHaveText(['CA', 'VA', 'ES']);
    await widget.locator('[data-lang-option="es"]').click();
    await expect(page.locator('h1')).toHaveText('Comunidad EduTicTac');
    expect((await context.cookies()).find(cookie => cookie.name === 'edutictac_language')?.value).toBe('es');
  });

  test('el tema Fosc es guarda i s’aplica abans del primer pintat en una altra pàgina', async ({ page }) => {
    await commons(page);
    await page.goto('/index.html');
    await page.locator('edutictac-account summary').click();
    await page.locator('edutictac-account [data-theme-option="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.route(`${COMMONS}/**`, route => route.abort());
    await page.goto('/privacitat.html');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('taulers: entrada real a Commons i tornada a edutictac.es', async ({ page, context }) => {
    await context.addCookies([{ name: 'edutictac_language', value: 'va', url: 'http://127.0.0.1:18640' }]);
    await commons(page);
    await page.goto('/tauler-professorat.html');
    await expect(page.getByRole('link', { name: 'Obrir el tauler de Commons' })).toHaveAttribute('href', `${COMMONS}/teacher.html`);
    await expect(page.getByRole('link', { name: '← Tornar a edutictac.es' })).toHaveAttribute('href', 'https://edutictac.es/');
    await expect(page.locator('.mockup-note')).toContainText('compte EduTicTac');
    await page.goto('/tauler-alumnat.html');
    await expect(page.getByRole('link', { name: 'Entrar amb codi i PIN' })).toHaveAttribute('href', `${COMMONS}/student.html`);
    await expect(page.locator('#student-code, #student-pin')).toHaveCount(0);
  });
});

test.describe('sense Commons', () => {
  for (const name of WITH_I18N) {
    test(`${name}: la pàgina es veu i torna el selector d’idioma local`, async ({ page }) => {
      await commons(page, 'down');
      await page.goto(`/${name}.html`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.lang-switch')).toBeVisible();
      await expect(page.locator('edutictac-account')).toBeHidden();
    });
  }

  test('l’alternativa porta també «Inici» (fora de la portada) i el tema', async ({ page }) => {
    await commons(page, 'down');
    await page.goto('/index.html');
    await expect(page.locator('.site-fallback')).toBeVisible();
    await expect(page.locator('.fallback-home')).toHaveCount(0);
    await page.goto('/privacitat.html');
    await expect(page.locator('.fallback-home')).toHaveAttribute('href', 'index.html');
    await page.emulateMedia({ colorScheme: 'light' });
    const theme = page.locator('.fallback-theme');
    await theme.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'light');
    await theme.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('el selector local funciona', async ({ page }) => {
    await commons(page, 'down');
    await page.goto('/index.html');
    await page.locator('.lang-switch [data-lang="es"]').click();
    await expect(page.locator('h1')).toHaveText('Comunidad EduTicTac');
  });

  test('si Commons no respon, el selector local apareix en uns segons', async ({ page }) => {
    await commons(page, 'hang');
    await page.goto('/index.html', { waitUntil: 'commit' });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.lang-switch')).toBeVisible({ timeout: 8000 });
  });
});

test('?lang= té prioritat sobre la galeta', async ({ page, context }) => {
  await context.addCookies([{ name: 'edutictac_language', value: 'ca', url: 'http://127.0.0.1:18640' }]);
  await commons(page, 'down');
  await page.goto('/index.html?lang=es');
  await expect(page.locator('h1')).toHaveText('Comunidad EduTicTac');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});
