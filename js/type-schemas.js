/* Terminal-style typing animation for the code-chip under the definition.
   Types line 1 (schemas), pauses, then types line 2 (build CTA). A
   blinking cursor follows the typing position. */
(function () {
  'use strict';

  const LINES = [
    'identity · asset · information · transaction · authentication',
  ];
  const TYPE_MS = 38;
  const START_DELAY_MS = 700;
  const PAUSE_BETWEEN_LINES = 1500;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function init() {
    const code = document.querySelector('.home_component .pn-code');
    if (!code) return;

    code.textContent = '';

    const lineEls = LINES.map(() => {
      const el = document.createElement('span');
      el.className = 'pn-code-line';
      const textNode = document.createTextNode('');
      el.appendChild(textNode);
      el._textNode = textNode;
      return el;
    });

    const cursor = document.createElement('span');
    cursor.className = 'pn-code-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = '▍';

    lineEls.forEach((el, i) => {
      if (i > 0) code.appendChild(document.createElement('br'));
      code.appendChild(el);
    });

    // Start with cursor inside the first line.
    lineEls[0].appendChild(cursor);

    await sleep(START_DELAY_MS);

    for (let i = 0; i < LINES.length; i++) {
      const el = lineEls[i];
      // Move cursor to this line (appending to a new parent moves the
      // single node, no duplicates).
      el.appendChild(cursor);

      const text = LINES[i];
      for (let c = 1; c <= text.length; c++) {
        el._textNode.textContent = text.slice(0, c);
        await sleep(TYPE_MS);
      }

      if (i < LINES.length - 1) {
        await sleep(PAUSE_BETWEEN_LINES);
      }
    }

    // Typing done — fade in the theme toggle immediately.
    const row = document.querySelector('.pn-theme-row');
    if (row) row.classList.add('is-visible');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
