# edutictac.es

Portal web estàtic de la **Comunitat EduTicTac** ([edutictac.es](https://edutictac.es)), l'espai públic d'accés als serveis d'EduTicTac Commons (recursos, Forgejo, DokuWiki, taulers…).

## Estructura

- `index.html` — pàgina principal del portal.
- `commons.html` — guia del professorat: què és EduTicTac Commons i com fer-lo servir.
- `privacitat.html` — política de privacitat.
- `tauler-professorat.html` — tauler (dashboard) del professorat.
- `tauler-alumnat.html` — tauler (dashboard) de l'alumnat.
- `styles/` — fulls d'estil:
  - `tailwind-input.css` — font de Tailwind (per recompilar).
  - `tailwind.css` — CSS compilat que fa servir el lloc.
  - `dashboards.css` — estils específics dels taulers.
  - `dark-mode.css` — mode fosc i selector d'idioma.
  - `fonts.css` — `@font-face` de les fonts autoallotjades (generat).
- `assets/fonts/` — fonts Inter i Poppins autoallotjades (OFL).
- `scripts/fetch-fonts.mjs` — descarrega les Google Fonts i les autoallotja.
- `scripts/theme.js` — commutador de mode clar/fosc.
- `scripts/i18n.js` — traduccions català/castellà i detecció d'idioma del navegador.
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
- `data-lang="ca|es"` — botons del selector d'idioma.

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
