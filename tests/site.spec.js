// Xip de compte de Commons, alternativa local i contracte d'idioma/tema.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const COMMONS = 'https://commons.edutictac.es';
const ASSETS = process.env.COMMONS_ASSETS || path.join(__dirname, '../../edutictac-commons/services/portal/public/assets');
const HAS_WIDGET = fs.existsSync(path.join(ASSETS, 'account-widget.js'));
const PAGES = ['index', 'commons', 'privacitat', 'instala-commons', 'edutictac-link', 'correu-classic', 'spike'];
const WITH_I18N = PAGES;

const anonymous = { authenticated: false, kind: 'anonymous', role: null, display_name: null, public_code: null, login_available: true,
  links: { login: '/api/auth/oidc/login?next=x', teacher: '/teacher.html', student: '/student.html', account: null, logout: '/api/auth/session/logout' } };

async function commons(page, mode = 'up', origin = 'http://127.0.0.1:18640') {
  await page.route(`${COMMONS}/**`, route => {
    if (mode === 'down') return route.abort();
    if (mode === 'hang') return; // Commons no respon mai
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/assets/')) return route.fulfill({ path: path.join(ASSETS, path.basename(url.pathname)) });
    if (url.pathname === '/api/auth/session') {
      return route.fulfill({ json: anonymous, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true' } });
    }
    return route.fulfill({ status: 404, body: '' });
  });
}

// Servix el lloc baix el domini públic per reproduir el cas real de la portada.
async function publicSite(page) {
  await page.route('https://edutictac.es/**', route => {
    const url = new URL(route.request().url());
    const file = path.join(__dirname, '..', url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    const ext = path.extname(file);
    const type = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : ext === '.png' ? 'image/png' : 'text/html';
    return route.fulfill({ path: file, headers: { 'content-type': type } });
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

  test('portada pública: el xip no cau a l’alternativa encara que amague «Inici»', async ({ page }) => {
    await commons(page, 'up', 'https://edutictac.es');
    await publicSite(page);
    await page.goto('https://edutictac.es/');
    await expect(page.locator('edutictac-account nav.eta')).toBeVisible();
    // A la portada el xip amaga l'enllaç d'inici a posta; no és cap fallada.
    await expect(page.locator('edutictac-account .eta-home')).toHaveCount(0);
    await page.waitForTimeout(6000);
    await expect(page.locator('.lang-switch')).toBeHidden();
    await expect(page.locator('edutictac-account nav.eta')).toBeVisible();
  });

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

  test('portada: avís de finalista 4D visible i enllaçat', async ({ page }) => {
    await commons(page, 'down');
    await page.goto('/index.html');
    const award = page.locator('.ett-award');
    await expect(award).toBeVisible();
    await expect(award.locator('#award-title')).toContainText('finalista');
    await expect(award.locator('a')).toHaveAttribute('href', 'https://4d.cat');
  });

  test('portada: la guia del professorat és visible', async ({ page }) => {
    await commons(page, 'down');
    await page.goto('/index.html');
    const guide = page.locator('a[href="commons.html"]');
    await expect(guide).toBeVisible();
    await expect(guide).not.toHaveAttribute('style', /display:\s*none/);
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

test.describe('peu comú', () => {
  test('instala-commons: les guies PDF es poden descarregar', async ({ page }) => {
    await commons(page, 'down');
    await page.goto('/instala-commons.html');
    await expect(page.locator('a[href$=".deb"]')).toHaveCount(0);
    for (const href of [
      'guia-installacio-edutictac-commons-beta6.2-va.pdf',
      'guia-instalacion-edutictac-commons-beta6.2-es.pdf',
    ]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
      const response = await page.request.get(new URL(href, page.url()).toString());
      expect(response.ok()).toBeTruthy();
      expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
    }
  });

  const FOOTERS = [
  ['index', 'Comunitat'],
  ['commons', 'Commons'],
  ['privacitat', 'Comunitat'],
  ['instala-commons', 'Commons'],
  ['edutictac-link', 'Link'],
  ['correu-classic', 'Correu clàssic'],
  ['spike', 'Simulador SPIKE'],
  ];

  for (const [name, service] of FOOTERS) {
    test(`${name}: un sol peu comú, també sense Commons`, async ({ page }) => {
      await commons(page, 'down');
      await page.goto(`/${name}.html`);
      const footer = page.locator('footer.ett-footer');
      await expect(footer).toHaveCount(1);
      await expect(footer.locator('.ett-footer__brand')).toHaveText('EduTicTac');
      await expect(footer.locator('.ett-footer__service')).toHaveText(service);
      await expect(footer.locator('.ett-footer__links a')).toHaveCount(4);
      await expect(footer.locator('.ett-footer__links a').nth(0)).toHaveAttribute('href', 'index.html');
      await expect(footer.locator('.ett-footer__links a').nth(1)).toHaveAttribute('href', /privacitat\.html|PRIVACY\.md/);
      await expect(footer.locator('.ett-footer__links a').nth(2)).toHaveAttribute('href', /^https:\/\//);
      await expect(footer.locator('.ett-footer__links a').nth(3)).toHaveText(/^(MIT|AGPL-3\.0|GPL-2\.0)$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }

  test('els enllaços del peu es traduïxen', async ({ page }) => {
    await commons(page, 'down');
    await page.goto('/index.html');
    await page.locator('.lang-switch [data-lang="es"]').click();
    const footer = page.locator('footer.ett-footer');
    await expect(footer.locator('.ett-footer__links a').nth(0)).toHaveText('Inicio');
    await expect(footer.locator('.ett-footer__links a').nth(1)).toHaveText('Privacidad');
    await expect(footer.locator('.ett-footer__links a').nth(2)).toHaveText('Código fuente');
  });
});

test('la còpia local del CSS del peu coincidix amb el de Commons', async () => {
  const canonical = path.join(ASSETS, 'edutictac-footer.css');
  test.skip(!fs.existsSync(canonical), 'Sense checkout de Commons: no es pot comparar el CSS del peu');
  expect(fs.readFileSync(path.join(__dirname, '..', 'styles', 'edutictac-footer.css'))).toEqual(fs.readFileSync(canonical));
});
