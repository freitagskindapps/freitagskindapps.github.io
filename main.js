// Fade-in on scroll using Intersection Observer
// Respects prefers-reduced-motion — no animation is applied when motion is reduced.

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  const targets = document.querySelectorAll(
    '.hero__eyebrow, .hero__title, .hero__body, .app-card, .principle'
  );

  targets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
