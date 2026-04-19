/* Glass layer scroll translation + reveal-driven circle tint.
   - Glass-layer is fixed at the top. Translate up by scrollY (clamped
     to viewport height) so it slides off on scroll.
   - Circle colour interpolates from the sidebar's snow (near-invisible
     through the glass at rest) to the imperfect-circle navy (focal
     point once revealed). Exposed as --pn-circle-fill on <html>.
   - pointer-events / visibility toggle off once glass is fully offscreen. */
(function () {
  'use strict';

  // Start colors ghost the circle against each mode's glass.
  // End colors are the fully-revealed circle: navy on light, near-white on dark.
  const LIGHT_START = [0xF3, 0xF5, 0xF9]; // panel snow
  const DARK_START  = [0x0A, 0x0E, 0x1A]; // dark bg
  const LIGHT_END   = [0x06, 0x0C, 0x22]; // navy
  const DARK_END    = [0xF2, 0xF3, 0xF7]; // --wotc-ink dark (matches text)

  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function mixRgb(t) {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const s = dark ? DARK_START : LIGHT_START;
    const e = dark ? DARK_END   : LIGHT_END;
    return 'rgb(' + lerp(s[0], e[0], t) + ',' +
                    lerp(s[1], e[1], t) + ',' +
                    lerp(s[2], e[2], t) + ')';
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
