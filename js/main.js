/**
 * bang — Profile Card JS
 * Lenis smooth scroll + micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initSmoothAnchorScroll();
});

/* ─── Lenis ──────────────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Expose for anchor scrolling
  window.__lenis = lenis;
}

/* ─── Smooth anchor scroll ───────────────────────────── */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();

      if (window.__lenis) {
        window.__lenis.scrollTo(targetEl, { offset: -20 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
