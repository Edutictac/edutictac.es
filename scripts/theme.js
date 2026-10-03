const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  const themeLabel = themeToggle.querySelector('.theme-toggle-label');
  const themeIcon = themeToggle.querySelector('[aria-hidden="true"]');

  function tr(key, fallback) {
    const api = window.EduTicTacI18n;
    if (api && typeof api.t === 'function' && typeof api.getLang === 'function') {
      const value = api.t(api.getLang(), key);
      if (typeof value === 'string') return value;
    }
    return fallback;
  }

  function updateThemeControl(theme) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? tr('theme.aria.light', 'Activa el mode clar') : tr('theme.aria.dark', 'Activa el mode fosc'));
    if (themeLabel) themeLabel.textContent = isDark ? tr('theme.label.light', 'Mode clar') : tr('theme.label.dark', 'Mode fosc');
    if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
  }

  updateThemeControl(document.documentElement.dataset.theme);
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('edutictac-theme', theme);
    } catch {
      // El canvi de tema funciona també quan no es pot guardar la preferència.
    }
    updateThemeControl(theme);
  });

  document.addEventListener('edutictac:langchange', () => {
    updateThemeControl(document.documentElement.dataset.theme);
  });
}
