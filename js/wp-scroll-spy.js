/* Scroll-spy for the whitepaper floating nav.
   Marks the nearest section as `.is-active` on .wp-nav-link so the
   reader always knows where they are in the document. Uses
   IntersectionObserver with a tall rootMargin so the active section
   updates the moment it enters the top third of the viewport. */
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

    function setActive(id) {
      linksById.forEach((el, key) => {
        el.classList.toggle('is-active', key === id);
      });
    }

    // Intersection approach: the last section whose top has crossed the
    // activation line is active. We track visibility state ourselves
    // rather than relying on IO entry ordering, which varies by browser.
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      if (!visible.size) return;
      // Pick the topmost visible section (smallest y).
      let best = null;
      let bestTop = Infinity;
      visible.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top < bestTop) { bestTop = top; best = id; }
      });
      if (best) setActive(best);
    }, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    });

    sections.forEach((s) => io.observe(s));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
