/* Light/dark theme toggle for the whitepaper.
   - Reads initial theme from the data-theme attribute set pre-paint by
     the inline script in <head> (which reads localStorage). Defaults
     to light if nothing is set.
   - Click flips the theme, swaps the moon/sun icon, and persists the
     choice to localStorage under the 'pn-theme' key.
   - Icon uses Phosphor (ph ph-moon / ph ph-sun, already loaded). */
(function () {
  'use strict';

  const STORAGE_KEY = 'pn-theme';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(theme, btn) {
    document.documentElement.setAttribute('data-theme', theme);
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    }
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function init() {
    const btn = document.getElementById('pn-theme-toggle');
    if (!btn) return;

    // Sync icon to whatever the pre-paint script decided.
    apply(currentTheme(), btn);

    btn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      apply(next, btn);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
