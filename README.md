# edutictac.es

Portal web estàtic de la **Comunitat EduTicTac** ([edutictac.es](https://edutictac.es)), l'espai públic d'accés als serveis d'EduTicTac Commons (recursos, Forgejo, DokuWiki, taulers…).

## Estructura

- `index.html` — pàgina principal del portal.
- `commons.html` — guia del professorat: què és EduTicTac Commons i com fer-lo servir.
- `privacitat.html` — política de privacitat.
- `tauler-professorat.html` — pàgina d'entrada al tauler docent de Commons (la resta és una vista prèvia del disseny).
- `tauler-alumnat.html` — pàgina d'entrada de l'alumnat (codi i PIN en Commons; la resta és una vista prèvia).
- `styles/` — fulls d'estil:
  - `tailwind-input.css` — font de Tailwind (per recompilar).
  - `tailwind.css` — CSS compilat que fa servir el lloc.
  - `dashboards.css` — estils específics dels taulers.
  - `dark-mode.css` — mode fosc, paleta del xip i selector local de respatler dels taulers.
  - `fonts.css` — `@font-face` de les fonts autoallotjades (generat).
- `assets/fonts/` — fonts Inter i Poppins autoallotjades (OFL).
- `assets/id/` — marca d'Authentik (`id.edutictac.es`): logo, favicon, icona i fons de les pantalles d'accés. Authentik les referencia per URL absoluta (`https://edutictac.es/assets/id/...`); no canvieu els noms sense actualitzar la marca a Authentik.
- `scripts/fetch-fonts.mjs` — descarrega les Google Fonts i les autoallotja.
- `scripts/theme-preference.js` — tema comú auto/clar/fosc abans del primer pintat (còpia idèntica de `services/portal/public/assets/theme-preference.js` d'EduTicTac Commons; actualitzeu-les alhora).
- `scripts/i18n.js` — traduccions català/valencià/castellà de la web; comparteix la galeta `edutictac_language` amb Commons.
- `scripts/taulers-i18n.js` — traduccions dels taulers a català, valencià, castellà i anglès; el valencià hereta del català i només defineix les formes que canvien.
- `deploy.sh` — desplegament per rsync al servidor (no versionat, vegeu `.gitignore`).
- `tailwind.config.js` — configuració de Tailwind (contingut: `index.html`, `commons.html`, `privacitat.html`).
- `LICENSE` — MIT.

## Desenvolupament

### Idiomes (català / castellà)

El portal detecta l'idioma del navegador: si és castellà mostra la versió en
castellà; en qualsevol altre cas (incloent-hi navegadors no catalans ni
castellans) mostra el català. La tria es pot canviar amb el selector `CA`/`ES`
de la capçalera i es guarda a `localStorage` (`edutictac-lang`).

El text per defecte viu a l'HTML en català (funciona sense JavaScript).
`scripts/i18n.js` tradueix els elements marcats amb:

- `data-i18n` — substitueix el text (`textContent`).
- `data-i18n-html` — substitueix el contingut (`innerHTML`), per a textos amb enllaços o `<strong>`.
- `data-i18n-aria-label`, `data-i18n-placeholder`, `data-i18n-title`, `data-i18n-content` — atributs.
- `data-lang="ca|va|es"` — botons del selector d'idioma local, que només es mostra si el xip de Commons no carrega (vegeu més avall).

Per afegir text nou, afegeix l'atribut a l'HTML i la clau corresponent a
l'objecte `TRANSLATIONS` de `scripts/i18n.js` amb els valors `ca` i `es`.

### Fonts autoallotjades

Les fonts (Inter, Poppins) es descarreguen i es serveixen localment per no dependre de Google Fonts:

```bash
node scripts/fetch-fonts.mjs
```

Regenera `styles/fonts.css` i baixa els fitxers a `assets/fonts/`.

### Recompilar el CSS de Tailwind

Si es toca `styles/tailwind-input.css` o `tailwind.config.js`, recompilar amb la CLI de Tailwind i sobreescriure `styles/tailwind.css`. Cal afegir també els taulers (`tauler-*.html`) a `content` de `tailwind.config.js` si han de fer servir aquests estils.

## Desplegament

```bash
./deploy.sh
```

Desplega el portal al servidor de producció per rsync.

## Llicència

MIT — vegeu `LICENSE`.

## Xip de compte i tornada a l'inici

Totes les pàgines mostren `<edutictac-account>`, el component Vue que publica
EduTicTac Commons (`https://commons.edutictac.es/assets/account-widget.js`): enllaç
«Inici», sessió real (nom i rol, o «Entrar»), accés al tauler, compte i eixida, i els
selectors d'idioma (CA/VA/ES) i de tema (Auto/Clar/Fosc), amb la paleta verda de Commons.
Només mostra la sessió: cap contingut d'esta web requerix entrar.

- **Sense bloquejar la pàgina:** l'script es carrega amb `defer` i porta el seu CSS;
  no hi ha cap `<link>` a Commons en el `<head>`.
- **Si Commons no respon:** l'atribut `onerror` de l'script, o un temps d'espera de 5 s
  en `scripts/i18n.js`, afig `account-fallback` a `<html>` i tornen a vore's els botons
  d'idioma locals. El tema guardat s'aplica igualment (`scripts/theme-preference.js`).
  Si Commons arriba tard, el xip substituïx de nou els botons.
- **Idioma:** ordre `?lang=` → galeta `edutictac_language` → `localStorage`
  (`edutictac-lang`) → navegador → català. La galeta només s'escriu quan algú tria
  l'idioma, perquè la detecció d'un navegador no s'impose a la resta de webs.
- **Taulers:** català, valencià, castellà i anglès. El valencià hereta del català
  i només canvia les formes valencianes (`scripts/taulers-i18n.js`). El tauler
  docent usa el mateix compte central; el botó d'iniciar sessió del bloc porta a
  entrar si encara no ho has fet.

### Idiomes dels taulers

Els dos taulers carreguen `scripts/taulers-i18n.js`, independent de la resta del
portal. Admeten **català, valencià, castellà i anglès** amb el mateix contracte:
`?lang=` → galeta `edutictac_language` → `localStorage` (`edutictac-lang`) →
navegador → català. La galeta només s'escriu en triar l'idioma.

- El **català és la base**; el valencià només defineix les formes que canvien.
- Els textos estàtics es tradueixen pel text original de la pàgina (`STATIC`).
- Els missatges dinàmics de credencials, resultats, errors i impressió utilitzen
  claus semàntiques (`DYNAMIC`) i es tornen a pintar en canviar d'idioma, sense
  recarregar la pàgina ni perdre els PIN visibles.
- El xip de Commons mostra CA/VA/ES/EN perquè el tauler registra
  `window.edutictacLanguage`; si el xip no carrega, apareix el selector local.

### Desplegament

L'ordre importa, perquè estes pàgines carreguen el xip des de Commons:

1. Commons (`id-api` i portal) amb `EDUTICTAC_ID_ALLOWED_ORIGINS=https://edutictac.es,https://*.edutictac.es`
   i `EDUTICTAC_ID_COOKIE_DOMAIN=.edutictac.es`; comprovar que
   `https://commons.edutictac.es/assets/account-widget.js` respon 200.
2. Esta web amb `./deploy.sh`. Abans, una còpia del directori publicat en el
   servidor per a poder tornar arrere amb `rsync`.

Proves: `npm ci` i `npm test` (Playwright). Simulen Commons a partir dels fitxers
d'un checkout d'EduTicTac Commons que ja porte el xip: `COMMONS_ASSETS` ha d'apuntar a
`<checkout>/services/portal/public/assets` (per defecte
`../edutictac-commons/services/portal/public/assets`). Si allí no hi ha
`account-widget.js`, les proves del xip **fallen** amb un missatge clar;
`ALLOW_NO_COMMONS=1 npm test` les omet i prova només la web sense Commons.
