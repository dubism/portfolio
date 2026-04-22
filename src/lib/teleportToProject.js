function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

let cancelCurrent = null;

export function teleportToProject(el, { offset = 80, overshoot = 60 } = {}) {
  // Cancel any in-progress animation
  if (cancelCurrent) {
    cancelCurrent();
    cancelCurrent = null;
  }

  return new Promise((resolve) => {
    let cancelled = false;
    cancelCurrent = () => {
      cancelled = true;
    };

    const html = document.documentElement;

    // Step 1: FADE OUT
    html.style.transition = 'opacity 150ms ease-in';
    html.style.opacity = '0';

    setTimeout(() => {
      if (cancelled) return;

      // Step 2: INSTANT JUMP (overshoot upward)
      html.style.scrollBehavior = 'auto';
      const targetTop = el.getBoundingClientRect().top + window.scrollY - offset;
      const overshootTop = targetTop - overshoot;
      window.scrollTo({ top: overshootTop, behavior: 'instant' });

      // Step 3: FADE IN + EASE DOWN
      html.style.transition = 'opacity 350ms ease-out';
      html.style.opacity = '1';

      const duration = 350;
      const startTime = performance.now();
      const startScroll = overshootTop;
      const endScroll = targetTop;

      function frame(now) {
        if (cancelled) return;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easedT = easeOutQuart(t);
        const currentScroll = startScroll + (endScroll - startScroll) * easedT;
        window.scrollTo({ top: currentScroll, behavior: 'instant' });

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          // Clean up
          html.style.scrollBehavior = '';
          html.style.transition = '';
          html.style.opacity = '';
          cancelCurrent = null;
          // Step 4: HIGHLIGHT (resolve so caller can apply it)
          resolve();
        }
      }

      requestAnimationFrame(frame);
    }, 150);
  });
}
