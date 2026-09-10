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
  - `fonts.css` — `@font-face` de les fonts autoallotjades (generat).
- `assets/fonts/` — fonts Inter i Poppins autoallotjades (OFL).
- `scripts/fetch-fonts.mjs` — descarrega les Google Fonts i les autoallotja.
- `deploy.sh` — desplegament per rsync al servidor (no versionat, vegeu `.gitignore`).
- `tailwind.config.js` — configuració de Tailwind (contingut: `index.html`, `commons.html`, `privacitat.html`).
- `LICENSE` — MIT.

## Desenvolupament

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
