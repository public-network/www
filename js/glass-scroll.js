/* Glass layer scroll translation + reveal-driven circle tint.
   - Glass-layer is fixed at the top. Translate up by scrollY (clamped
     to viewport height) so it slides off on scroll.
   - Circle colour interpolates from the sidebar's snow (near-invisible
     through the glass at rest) to the imperfect-circle navy (focal
     point once revealed). Exposed as --pn-circle-fill on <html>.
   - pointer-events / visibility toggle off once glass is fully offscreen. */
(function () {
  'use strict';

  // Panel snow → real imperfect-circle navy.
  const START = [0xF3, 0xF5, 0xF9];
  const END   = [0x06, 0x0C, 0x22];

  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function mixRgb(t) {
    return 'rgb(' + lerp(START[0], END[0], t) + ',' +
                    lerp(START[1], END[1], t) + ',' +
                    lerp(START[2], END[2], t) + ')';
  }

  function init() {
    const glass = document.getElementById('glass-layer');
    if (!glass) return;
    const root = document.documentElement;
    const cue = document.querySelector('.reveal-cue');

    function apply() {
      const h = window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), h);

      glass.style.transform = 'translate3d(0,' + (-y) + 'px,0)';
      glass.style.pointerEvents = y >= h - 1 ? 'none' : 'auto';
      glass.style.visibility = y >= h - 1 ? 'hidden' : 'visible';

      // Swap the circle's fill from panel-snow to real navy entirely
      // within the first ~20% of scroll. The circle is centred in the
      // viewport (~y=165 to y=635) and the glass doesn't start to
      // expose it until scrollY ≈ 165 (~20% of viewport), so by the
      // time any pixel of the circle is visible, it's already navy.
      // User should experience a hidden colour change.
      const t = Math.min(1, (y / h) / 0.2);
      const eased = t * t * (3 - 2 * t);
      root.style.setProperty('--pn-circle-fill', mixRgb(eased));

      // Fade out the scroll cue as the reveal starts — gone by ~40%
      // of scroll so it doesn't fight the circle for attention.
      if (cue) cue.style.opacity = String(Math.max(0, 0.55 * (1 - (y / h) * 2.5)));
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
