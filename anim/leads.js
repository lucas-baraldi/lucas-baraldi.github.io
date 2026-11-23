// Lead enrichment: a grid of grey dots -> a sweep -> the dots gather into clusters.
import { stage, pal, E, P, fade, lerp, hash, circle, dot, seg, text, pulse } from './kit.js';

const COLS = 12, ROWS = 7;
const CLUSTERS = [[104, 110, 34], [300, 96, 28], [214, 206, 40]];
const DOTS = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;
    const g = hash(i) < 0.3 ? 0 : hash(i) < 0.55 ? 1 : 2;
    const a = hash(i + 50) * Math.PI * 2;
    const d = Math.sqrt(hash(i + 90)) * (CLUSTERS[g][2] - 7);
    DOTS.push({
      x0: 56 + c * 26, y0: 54 + r * 30,
      x1: CLUSTERS[g][0] + Math.cos(a) * d, y1: CLUSTERS[g][1] + Math.sin(a) * d,
      g, delay: hash(i + 7) * 0.6
    });
  }
}

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    const sweepX = lerp(40, 360, P(tt, 0.9, 3.0));
    const sweeping = tt > 0.9 && tt < 3.0;
    if (sweeping) seg(ctx, sweepX, 36, sweepX, 252, 1, pal.ink);

    const live = tt > 5.6;
    DOTS.forEach(d => {
      const k = E(tt, 3.2 + d.delay, 4.6 + d.delay);
      const x = lerp(d.x0, d.x1, k), y = lerp(d.y0, d.y1, k);
      const seen = d.x0 < sweepX && tt > 0.9;
      const color = live && d.g === 2 ? pal.accent : seen ? pal.ink : pal.muted;
      fade(ctx, seen ? 1 : 0.55, () => dot(ctx, x, y, 2.3, color));
    });

    CLUSTERS.forEach(([x, y, r], i) => {
      const k = E(tt, 4.8 + i * 0.15, 5.5 + i * 0.15);
      if (k <= 0) return;
      ctx.beginPath();
      ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
      ctx.strokeStyle = i === 2 && live ? pal.accent : pal.faint;
      ctx.stroke();
    });
    text(ctx, 'company base', 56, 272, { chars: P(tt, 0.3, 0.9) * (1 - P(tt, 3.0, 3.3)) });
    text(ctx, 'economic groups', 56, 272, { chars: P(tt, 4.9, 5.5) });
    pulse(ctx, 270, 272, tt, 5.6);
    text(ctx, 'worth a call', 280, 272, { color: pal.accent, chars: P(tt, 5.6, 6.2) });
  });
}
