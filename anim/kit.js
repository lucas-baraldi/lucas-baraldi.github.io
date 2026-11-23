// Shared drawing kit for the case animations.
// Every module exports renderAt(ctx, w, h, t): the picture depends only on t (seconds).
// No clock and no randomness in here; the runner owns time.

export const LOOP = 8;
export const VW = 400;
export const VH = 300;

export const pal = {
  ink: '#F5F5F7',
  muted: '#8E8E93',
  faint: 'rgba(255,255,255,.14)',
  accent: '#34E08A',
  surface: '#141416'
};
export function setPalette(p) { Object.assign(pal, p); }

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const P = (t, a, b) => clamp((t - a) / (b - a));
export const out = x => 1 - Math.pow(1 - clamp(x), 4);
export const io = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const E = (t, a, b) => out(P(t, a, b));
// deterministic pseudo-noise in [0, 1)
export const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';
const MIN_TEXT = 9.5; // smallest label size on screen, in CSS px
let scale = 1;

export function stage(ctx, w, h, t, draw) {
  const tt = ((t % LOOP) + LOOP) % LOOP;
  const s = Math.min(w / VW, h / VH);
  scale = s;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate((w - VW * s) / 2, (h - VH * s) / 2);
  ctx.scale(s, s);
  ctx.lineWidth = 1.5 / s;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = E(tt, 0, 0.6) * (1 - io(P(tt, 7.4, 8)));
  ctx.strokeStyle = pal.ink;
  ctx.fillStyle = pal.ink;
  draw(tt);
  ctx.restore();
}

// run fn with alpha multiplied by a and an optional rise of dy px
export function fade(ctx, a, fn, dy = 0) {
  if (a <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= clamp(a);
  if (dy) ctx.translate(0, dy * (1 - clamp(a)));
  fn();
  ctx.restore();
}

export function rr(ctx, x, y, w, h, r = 6) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
export function box(ctx, x, y, w, h, r = 6, color = pal.ink) {
  rr(ctx, x, y, w, h, r);
  ctx.strokeStyle = color;
  ctx.stroke();
}
export function circle(ctx, x, y, r, color = pal.ink, fill = false) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.stroke(); }
}
export const dot = (ctx, x, y, r = 2.5, color = pal.ink) => circle(ctx, x, y, r, color, true);

// point at fraction k along a polyline
export function along(pts, k) {
  const len = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    len.push(d);
    total += d;
  }
  let d = clamp(k) * total;
  for (let i = 0; i < len.length; i++) {
    if (d <= len[i] || i === len.length - 1) {
      const f = len[i] ? clamp(d / len[i]) : 0;
      return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f), i, f];
    }
    d -= len[i];
  }
  return [pts[0][0], pts[0][1], 0, 0];
}
// draw a polyline up to fraction k
export function path(ctx, pts, k = 1, color = pal.ink, dash = null) {
  if (k <= 0) return;
  const [ex, ey, seg] = along(pts, k);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= seg; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.lineTo(ex, ey);
  ctx.strokeStyle = color;
  if (dash) ctx.setLineDash(dash);
  ctx.stroke();
  if (dash) ctx.setLineDash([]);
}
export const seg = (ctx, x1, y1, x2, y2, k = 1, color = pal.ink) => path(ctx, [[x1, y1], [x2, y2]], k, color);

export function check(ctx, x, y, size, k = 1, color = pal.accent) {
  path(ctx, [[x - size * 0.5, y], [x - size * 0.12, y + size * 0.36], [x + size * 0.5, y - size * 0.34]], k, color);
}
// optional label translations, keyed by the English label
let dict = {};
export function setDict(d) { dict = d || {}; }

export function text(ctx, label, x, y, { size = 10, color = pal.muted, align = 'left', chars = 1 } = {}) {
  const str = dict[label] || label;
  const n = Math.round(str.length * clamp(chars));
  if (!n) return;
  ctx.font = `500 ${Math.max(size, MIN_TEXT / scale)}px ${MONO}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(str.slice(0, n), x, y);
}
// short horizontal bars standing in for lines of copy
export function bars(ctx, x, y, widths, gap = 9, k = 1, color = pal.faint) {
  widths.forEach((wd, i) => seg(ctx, x, y + i * gap, x + wd, y + i * gap, clamp(k * widths.length - i), color));
}
// speech bubble with a tail on the bottom-left or bottom-right
export function bubble(ctx, x, y, w, h, color = pal.ink, side = 'left') {
  const r = 9;
  const tx = side === 'left' ? x + 16 : x + w - 16;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  if (side === 'right') { ctx.lineTo(tx + 3, y + h); ctx.lineTo(tx + 6, y + h + 9); ctx.lineTo(tx - 7, y + h); }
  else { ctx.lineTo(tx + 7, y + h); ctx.lineTo(tx - 6, y + h + 9); ctx.lineTo(tx - 3, y + h); }
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
}
// expanding ring used for the "live" moment
export function pulse(ctx, x, y, t, t0, color = pal.accent) {
  if (t < t0) return;
  const k = ((t - t0) % 1.6) / 1.6;
  fade(ctx, (1 - k) * 0.6, () => circle(ctx, x, y, 3 + k * 5, color));
  dot(ctx, x, y, 3, color);
}
