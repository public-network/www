/* Glass layer scroll translation.
   The glass-layer is position: fixed at the top. On scroll, we translate
   it upward by scrollY (clamped to the viewport height) so it slides
   smoothly out of view as the user scrolls down — revealing the
   interface layer (schemas + whitepaper) behind it. Also toggle
   pointer-events off once it's fully off screen so content below is
   interactable. */
(function () {
  'use strict';

  function init() {
    const glass = document.getElementById('glass-layer');
    if (!glass) return;

    function apply() {
      const h = window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), h);
      glass.style.transform = 'translate3d(0,' + (-y) + 'px,0)';
      glass.style.pointerEvents = y >= h - 1 ? 'none' : 'auto';
      glass.style.visibility = y >= h - 1 ? 'hidden' : 'visible';
    }

    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
