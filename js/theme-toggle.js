/* Theme toggle — single icon, system-aware.
   Reads system preference on load, shows moon (light) or sun (dark).
   Click flips the theme and swaps the icon. Persists to localStorage. */
(function () {
  'use strict';

  const STORAGE_KEY = 'pn-theme';

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme, btn) {
    document.documentElement.setAttribute('data-theme', theme);
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function init() {
    const btn = document.getElementById('pn-theme-toggle');
    if (!btn) return;

    // Resolve initial theme: saved override, or system preference.
    let theme;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      theme = (saved === 'dark' || saved === 'light') ? saved : systemTheme();
    } catch (e) {
      theme = systemTheme();
    }

    apply(theme, btn);

    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      apply(theme, btn);
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    });

    // Follow OS changes if no manual override is saved.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try { if (localStorage.getItem(STORAGE_KEY)) return; } catch (e) {}
      theme = e.matches ? 'dark' : 'light';
      apply(theme, btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
