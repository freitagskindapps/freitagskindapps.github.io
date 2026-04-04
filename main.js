// Fade-in on scroll using Intersection Observer
// Respects prefers-reduced-motion — no animation is applied when motion is reduced.

(function () {
  'use strict';

  // When Tab has an App Store or public web URL, set this to show the primary CTA on the card.
  var FREITAGSKIND_TAB_APP_STORE_URL = '';

  (function initTabCardCta() {
    var url = typeof FREITAGSKIND_TAB_APP_STORE_URL === 'string' ? FREITAGSKIND_TAB_APP_STORE_URL.trim() : '';
    var note = document.getElementById('tab-card-note');
    if (!url || !note) return;

    var a = document.createElement('a');
    a.className = 'app-card__cta';
    a.href = url;
    a.textContent = 'View on the App Store';
    if (/^https?:\/\//i.test(url)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    note.replaceWith(a);
  })();

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
