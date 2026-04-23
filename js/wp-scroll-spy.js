/* Scroll-spy for the whitepaper floating nav.
   Marks the nearest section as `.is-active` on .wp-nav-link so the
   reader always knows where they are in the document.

   Strategy: for each section, compute its top relative to the viewport.
   The active section is the one whose top is closest to (but not below)
   an activation line 68% down the viewport. The deeper activation line
   lets short ending sections like "imperfect circle" become active
   before the document hits the final scroll position. At the very
   bottom of the page, force the last section active so the final
   documentation section does not get skipped. */
(function () {
  'use strict';

  function init() {
    const nav = document.querySelector('.wp-nav');
    if (!nav) return;

    const sections = Array.from(document.querySelectorAll('.wp-section'));
    if (!sections.length) return;

    const linksById = new Map();
    nav.querySelectorAll('.wp-nav-link').forEach((a) => {
      const id = (a.getAttribute('href') || '').replace('#', '');
      if (id) linksById.set(id, a);
    });

    const lastSection = sections[sections.length - 1];

    function setActive(id) {
      linksById.forEach((el, key) => {
        el.classList.toggle('is-active', key === id);
      });
    }

    function update() {
      // Activation line sits 68% down the viewport. The desktop app uses
      // the same ratio so short final sections still enter the nav state.
      const activationLine = window.innerHeight * 0.68;
      let best = sections[0].id;
      let bestTop = -Infinity;
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= activationLine && top > bestTop) {
          bestTop = top;
          best = section.id;
        }
      });

      // Bottom-of-page override: if the user has scrolled to the absolute
      // end of the document, force the last section active. Short final
      // sections may never have their top cross the activation line
      // because the page can't scroll far enough.
      const atBottom = window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && lastSection) {
        best = lastSection.id;
      }

      setActive(best);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
