/* SKCE Portfolio — interactive behaviors
 * Ported to vanilla JS from the original DC component (count-up, mouse
 * parallax, scroll-spy nav highlight). Content is fully static in index.html;
 * this only adds motion/interaction. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var scope = document.getElementById('sk-portfolio') || document;

    // ── Number count-up ──────────────────────────────────────────────────
    function countUp(el) {
      if (el._done) return;
      el._done = true;
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1300;
      var start = performance.now();
      function step(now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var counters = [].slice.call(scope.querySelectorAll('[data-count]'));
    function runNear() {
      var h = window.innerHeight || 800;
      counters.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.top < h * 0.95 && r.bottom > -60) countUp(c);
      });
    }
    runNear();
    window.addEventListener('scroll', runNear, { passive: true });
    window.addEventListener('resize', runNear, { passive: true });
    setTimeout(runNear, 1500);

    // ── Scroll-spy: highlight the active nav link ────────────────────────
    var navLinks = [].slice.call(scope.querySelectorAll('[data-nav]'));
    if ('IntersectionObserver' in window) {
      var navIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var id = e.target.id;
            navLinks.forEach(function (l) {
              var on = l.getAttribute('href') === '#' + id;
              l.style.color = on ? 'var(--accent)' : '#5a5a63';
              l.style.fontWeight = on ? '700' : '400';
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      scope.querySelectorAll('section[id]').forEach(function (s) { navIo.observe(s); });
    }

    // ── Hamburger menu ───────────────────────────────────────────────────
    var ham = document.getElementById('mob-ham');
    var mobNav = ham && ham.closest('nav');
    if (ham && mobNav) {
      ham.addEventListener('click', function (e) {
        e.stopPropagation();
        mobNav.classList.toggle('mob-open');
      });
      document.addEventListener('click', function (e) {
        if (mobNav.classList.contains('mob-open') && !mobNav.contains(e.target)) {
          mobNav.classList.remove('mob-open');
        }
      });
      mobNav.querySelectorAll('[data-desknav] a').forEach(function (a) {
        a.addEventListener('click', function () { mobNav.classList.remove('mob-open'); });
      });
    }

    // ── Mouse parallax on the atmospheric backdrop blobs ─────────────────
    window.addEventListener('mousemove', function (ev) {
      var x = (ev.clientX / window.innerWidth - 0.5);
      var y = (ev.clientY / window.innerHeight - 0.5);
      scope.querySelectorAll('[data-par]').forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-par')) || 0;
        el.style.transform = 'translate(' + (x * d).toFixed(1) + 'px,' + (y * d).toFixed(1) + 'px)';
      });
    }, { passive: true });
  });
})();
