/* Theme segmented control — system / manual toggle.
   Two buttons: Monitor (system) + Moon/Sun (manual override).
   Persists choice to localStorage under 'pn-theme'.
   Values: 'system' | 'dark' | 'light'. */
(function () {
  'use strict';

  const STORAGE_KEY = 'pn-theme';

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function effectiveTheme(mode) {
    return mode === 'system' ? systemTheme() : mode;
  }

  function render(mode, sysBtn, manBtn) {
    const effective = effectiveTheme(mode);

    // Apply theme to document.
    document.documentElement.setAttribute('data-theme', effective);

    // Selected state.
    sysBtn.classList.toggle('is-selected', mode === 'system');
    manBtn.classList.toggle('is-selected', mode !== 'system');

    // Right button icon = opposite of current effective theme (shows what you'd switch to).
    const manIcon = manBtn.querySelector('i');
    if (manIcon) {
      manIcon.className = effective === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    }
    manBtn.setAttribute('aria-label',
      effective === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function init() {
    const sysBtn = document.getElementById('pn-seg-system');
    const manBtn = document.getElementById('pn-seg-manual');
    if (!sysBtn || !manBtn) return;

    let mode = 'system';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'system') mode = saved;
    } catch (e) {}

    render(mode, sysBtn, manBtn);

    sysBtn.addEventListener('click', () => {
      mode = 'system';
      try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
      render(mode, sysBtn, manBtn);
    });

    manBtn.addEventListener('click', () => {
      // Toggle to opposite of current effective theme.
      mode = effectiveTheme(mode) === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
      render(mode, sysBtn, manBtn);
    });

    // Re-render when OS theme changes (only matters when mode = 'system').
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (mode === 'system') render(mode, sysBtn, manBtn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
