/* Interface-layer interactions:
   - Home button smooth-scrolls back to y=0 so the glass slides down.
   - Sidebar toggle (and the canvas show-sidebar twin) collapse/expand
     the sidebar via a class on .interface-layer. CSS drives the
     animation. aria-expanded is kept in sync on both buttons. */
(function () {
  'use strict';

  function initHomeButton() {
    const btn = document.querySelector('.iface-home');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initSidebarToggle() {
    const toggle = document.getElementById('iface-toggle');
    if (!toggle) return;

    function setCollapsed(collapsed) {
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      toggle.setAttribute('aria-expanded', String(!collapsed));
    }

    toggle.addEventListener('click', () => {
      setCollapsed(!document.body.classList.contains('sidebar-collapsed'));
    });
  }

  function init() {
    initHomeButton();
    initSidebarToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
