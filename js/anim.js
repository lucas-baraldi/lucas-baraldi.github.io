// Mounts the case animations. The modules in /anim are pure: renderAt(ctx, w, h, t).
// This file owns the clock: a canvas only runs while it is on screen.
import { setPalette, setDict, LOOP } from '../anim/kit.js';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = Math.min(window.devicePixelRatio || 1, 2);
const STILL = 6.6; // the "live" moment, used as the static frame
const items = new Map();
let raf = 0;

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const v = n => cs.getPropertyValue(n).trim();
  setPalette({ ink: v('--text'), muted: v('--muted'), faint: v('--line-strong'), accent: v('--accent'), surface: v('--surface') });
}

function size(it) {
  const r = it.canvas.getBoundingClientRect();
  it.w = Math.max(1, Math.round(r.width));
  it.h = Math.max(1, Math.round(r.height));
  it.canvas.width = Math.round(it.w * DPR);
  it.canvas.height = Math.round(it.h * DPR);
  it.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function draw(it, t) {
  if (!it.render) return;
  it.render(it.ctx, it.w, it.h, t);
}

function tick(now) {
  raf = 0;
  let running = false;
  items.forEach(it => {
    if (!it.visible || !it.render) return;
    running = true;
    draw(it, ((now - it.t0) / 1000) % LOOP);
  });
  if (running) raf = requestAnimationFrame(tick);
}
const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(tick); };

async function load(it) {
  if (it.loading) return;
  it.loading = true;
  try {
    const mod = await import(`../anim/${it.name}.js`);
    if (document.fonts && document.fonts.load) { try { await document.fonts.load('500 10px "Geist Mono"'); } catch (e) { /* fallback font */ } }
    it.render = mod.renderAt;
    size(it);
    if (reduce) draw(it, STILL); else kick();
  } catch (e) {
    it.loading = false;
  }
}

async function init() {
  readPalette();
  if (document.documentElement.lang.toLowerCase().startsWith('pt')) {
    try { setDict((await import('../anim/pt.js')).default); } catch (e) { /* English labels */ }
  }
  const canvases = document.querySelectorAll('canvas[data-anim]');
  if (!canvases.length) return;

  const near = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { load(items.get(e.target)); near.unobserve(e.target); } });
  }, { rootMargin: '400px 0px' });

  const seen = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const it = items.get(e.target);
      const was = it.visible;
      it.visible = e.isIntersecting;
      if (it.visible && !was) { it.t0 = performance.now(); kick(); }
    });
  }, { threshold: 0.2 });

  const resized = new ResizeObserver(entries => {
    entries.forEach(e => {
      const it = items.get(e.target);
      if (!it.render) return;
      size(it);
      if (reduce) draw(it, STILL);
    });
  });

  canvases.forEach(canvas => {
    const it = { canvas, ctx: canvas.getContext('2d'), name: canvas.dataset.anim, visible: false, t0: 0, w: 1, h: 1, render: null, loading: false };
    items.set(canvas, it);
    near.observe(canvas);
    seen.observe(canvas);
    resized.observe(canvas);
  });

  document.addEventListener('themechange', () => {
    readPalette();
    if (reduce) items.forEach(it => draw(it, STILL));
  });
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    readPalette();
    if (reduce) items.forEach(it => draw(it, STILL));
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
}

init();
