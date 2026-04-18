/* App-style tab switcher with fade transitions between the Whitepaper
   and Documentation pages. */
(function () {
  'use strict';

  const FADE_MS = 260;

  function init() {
    const tabs = Array.from(document.querySelectorAll('.app-nav .app-tab'));
    const pages = Array.from(document.querySelectorAll('.app-page'));
    if (!tabs.length || !pages.length) return;

    function setActive(pageName, opts) {
      opts = opts || {};
      const push = opts.push !== false;

      tabs.forEach((t) => {
        t.classList.toggle('is-active', t.dataset.page === pageName);
      });

      const current = pages.find((p) => p.classList.contains('is-active'));
      const next = pages.find((p) => p.dataset.page === pageName);
      if (!next || next === current) return;

      if (current) {
        current.classList.add('is-leaving');
        current.classList.remove('is-active');
        setTimeout(() => {
          current.classList.remove('is-leaving');
          current.hidden = true;
          current.setAttribute('aria-hidden', 'true');
        }, FADE_MS);
      }

      next.hidden = false;
      next.removeAttribute('aria-hidden');
      // Force layout so the browser sees the opacity: 0 starting state
      // (from the base .app-page rule), then flip to is-active so the
      // opacity transition runs. Without the reflow, some browsers skip
      // the transition.
      // eslint-disable-next-line no-unused-expressions
      next.offsetWidth;
      setTimeout(() => {
        next.classList.add('is-active');
      }, 20);

      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

      if (push && history.replaceState) {
        history.replaceState(null, '', '#' + pageName);
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        setActive(tab.dataset.page);
      });
    });

    // Honor the hash on load (e.g. if someone opens /#documentation).
    const hash = window.location.hash.replace('#', '');
    if (hash && pages.some((p) => p.dataset.page === hash)) {
      setActive(hash, { push: false });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
