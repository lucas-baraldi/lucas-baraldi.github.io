/* Page motion. Plain script, no build step. GSAP, ScrollTrigger and Lenis are loaded from /vendor. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---- theme ---- */
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    document.dispatchEvent(new CustomEvent('themechange'));
  }
  var toggle = $('[data-theme-toggle]');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(currentTheme() === 'light'));
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      toggle.setAttribute('aria-pressed', String(next === 'light'));
      if (document.startViewTransition && !reduce) document.startViewTransition(function () { setTheme(next); });
      else setTheme(next);
    });
  }

  /* ---- language links keep the current section ---- */
  $$('.lang a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash;
    });
  });

  /* ---- status chip: demo -> live ---- */
  var chip = $('[data-chip]');
  if (chip) {
    var out = $('[data-chip-text]', chip);
    var demo = chip.getAttribute('data-demo');
    var live = chip.getAttribute('data-live');
    if (reduce) { out.textContent = live; chip.classList.add('is-live'); }
    else {
      var prefix = 0;
      while (prefix < demo.length && demo[prefix] === live[prefix]) prefix++;
      var frames = [];
      var i;
      for (i = 1; i <= demo.length; i++) frames.push([demo.slice(0, i), 45]);
      frames[frames.length - 1][1] = 900;
      for (i = demo.length - 1; i >= prefix; i--) frames.push([demo.slice(0, i), 40]);
      for (i = prefix + 1; i <= live.length; i++) frames.push([live.slice(0, i), 60]);
      out.textContent = '';
      var n = 0;
      var step = function () {
        if (n >= frames.length) { chip.classList.add('is-live'); return; }
        out.textContent = frames[n][0];
        setTimeout(step, frames[n++][1]);
      };
      setTimeout(step, 350);
    }
  }

  /* ---- reveals ---- */
  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- everything below needs GSAP and allowed motion ---- */
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  var EASE = 'expo.out';

  /* smooth scroll */
  if (window.Lenis) {
    var lenis = new window.Lenis({ lerp: 0.12, anchors: { offset: -72 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* reading progress */
  var bar = $('[data-progress]');
  if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

  /* hero light moves at 0.3x of the scroll */
  var bg = $('[data-parallax]');
  var hero = $('.hero');
  if (bg && hero) {
    gsap.to(bg, {
      y: function () { return hero.offsetHeight * 0.3; },
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
    });
  }

  /* how I work: the one pinned section. Structure after Motion Prompt #076 (pin, stepped number, progress line). */
  var process = $('[data-process]');
  if (process) {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (min-height: 620px)', function () {
      process.classList.add('is-pinned');
      var stage = $('.process__stage', process);
      var roll = $('[data-roll]', process);
      var line = $('[data-line]', process);
      var steps = $$('[data-steps] li', process);
      var active = -1;
      var show = function (idx) {
        if (idx === active) return;
        active = idx;
        steps.forEach(function (li, k) { li.classList.toggle('is-active', k === idx); });
        gsap.to(roll, { yPercent: -25 * idx, duration: 0.8, ease: EASE, overwrite: true });
      };
      show(0);
      var st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: true,
        onUpdate: function (self) {
          gsap.set(line, { scaleY: self.progress });
          show(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
        }
      });
      return function () {
        st.kill();
        process.classList.remove('is-pinned');
        gsap.set([roll, line], { clearProps: 'all' });
        steps.forEach(function (li, k) { li.classList.toggle('is-active', k === 0); });
      };
    });
  }

  /* magnetic button, pointer devices only. Pull range and strength after Motion Prompt #084; settles without bounce. */
  var magnet = $('[data-magnet]');
  if (magnet && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var toX = gsap.quickTo(magnet, 'x', { duration: 0.5, ease: 'power3.out' });
    var toY = gsap.quickTo(magnet, 'y', { duration: 0.5, ease: 'power3.out' });
    var R = 110;
    var PULL = 0.35;
    window.addEventListener('pointermove', function (e) {
      var r = magnet.getBoundingClientRect();
      if (r.bottom < -R || r.top > window.innerHeight + R) return;
      var cx = r.left + r.width / 2 - gsap.getProperty(magnet, 'x');
      var cy = r.top + r.height / 2 - gsap.getProperty(magnet, 'y');
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var inside = Math.abs(dx) < r.width / 2 + R * 0.5 && Math.abs(dy) < r.height / 2 + R * 0.5;
      toX(inside ? dx * PULL : 0);
      toY(inside ? dy * PULL : 0);
    }, { passive: true });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
