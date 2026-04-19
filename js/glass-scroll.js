/* Glass layer scroll translation + reveal-driven circle tint + zoom.
   - Glass-layer is fixed at the top. Translate up by scrollY (clamped
     to viewport height) so it slides off on scroll.
   - Circle colour interpolates from ghost colour to revealed colour,
     theme-aware so the circle is invisible at rest in both modes.
   - Circle zooms in 2% then back to 100% over the reveal window:
     starts the moment the glass exposes the circle's top edge, peaks
     at 50% of that window, returns to 1.0 exactly when the whitepaper
     enters (glass fully off). Uses sin(π·t) for smooth in-out.
   - pointer-events / visibility toggle off once glass is fully offscreen. */
(function () {
  'use strict';

  const LIGHT_START = [0xF3, 0xF5, 0xF9]; // panel snow  — ghosts on white glass
  const DARK_START  = [0x0A, 0x0E, 0x1A]; // dark bg     — ghosts on dark glass
  const LIGHT_END   = [0x06, 0x0C, 0x22]; // navy        — revealed on light
  const DARK_END    = [0xF2, 0xF3, 0xF7]; // near-white  — revealed on dark

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
    const root   = document.documentElement;
    const cue    = document.querySelector('.reveal-cue');
    const circle = document.querySelector('.iface-hero-circle');

    // Cache circle height; refresh on resize.
    let circleH = circle ? circle.offsetHeight : 0;

    function apply() {
      const h = window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), h);

      // Slide glass off.
      glass.style.transform   = 'translate3d(0,' + (-y) + 'px,0)';
      glass.style.pointerEvents = y >= h - 1 ? 'none' : 'auto';
      glass.style.visibility    = y >= h - 1 ? 'hidden' : 'visible';

      // Circle colour: ghost → revealed over first 20% of scroll.
      const colorT   = Math.min(1, (y / h) / 0.2);
      const colorEased = colorT * colorT * (3 - 2 * colorT);
      root.style.setProperty('--pn-circle-fill', mixRgb(colorEased));

      // Scroll cue fade.
      if (cue) cue.style.opacity = String(Math.max(0, 0.55 * (1 - (y / h) * 2.5)));

      // Circle zoom: two-phase continuous motion, always moving once revealed.
      // Glass slides UP, so the circle's bottom edge is exposed first.
      // zoomStart = scrollY when glass bottom hits circle bottom edge:
      //   glass bottom = h - rawY = h/2 + circleH/2  →  rawY = (h - circleH) / 2
      // Phase 1: first pixel revealed → glass fully off  (scale 1.0 → 1.03)
      // Phase 2: glass off → circle exits top of viewport (scale 1.03 → 0.97)
      if (circle) {
        const rawY    = window.scrollY;
        const zoomStart = (h - circleH) / 2;          // first pixel of circle exposed
        const revealEnd = h;                            // glass fully off
        const exitEnd   = h + (h + circleH) / 2;       // circle scrolls off top

        let scale = 1;
        if (rawY >= zoomStart && rawY <= revealEnd) {
          const t = (rawY - zoomStart) / (revealEnd - zoomStart);
          scale = 1 + 0.03 * t;          // 1.000 → 1.030
        } else if (rawY > revealEnd) {
          const t = Math.min(1, (rawY - revealEnd) / (exitEnd - revealEnd));
          scale = 1.03 - 0.06 * t;       // 1.030 → 0.970
        }
        circle.style.transform = 'scale(' + scale.toFixed(4) + ')';
      }
    }

    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', () => {
      circleH = circle ? circle.offsetHeight : 0;
      apply();
    });
    // Re-run immediately when theme toggles so --pn-circle-fill snaps to
    // the correct ghost colour without waiting for the next scroll event.
    new MutationObserver(apply).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme'],
    });
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
