// Agent gateway: several small nodes -> converge on one gate -> a trace line comes out.
import { stage, pal, E, P, fade, circle, dot, path, seg, box, text, along, pulse } from './kit.js';

const NODES = [[46, 56], [84, 104], [40, 150], [90, 196], [50, 244]];
const GX = 196, GY = 150;

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    // agents
    NODES.forEach(([x, y], i) => {
      const k = E(tt, 0.2 + i * 0.12, 0.8 + i * 0.12);
      fade(ctx, k, () => circle(ctx, x, y, 7, pal.ink));
      const line = [[x + 7, y], [150, y], [GX - 16, GY]];
      path(ctx, line, E(tt, 1.0 + i * 0.1, 1.9 + i * 0.1), pal.faint);
      // requests travelling in, staggered
      const p = P(tt, 2.0 + i * 0.28, 3.0 + i * 0.28);
      if (p > 0 && p < 1) { const [px, py] = along(line, p); dot(ctx, px, py, 2.2, pal.ink); }
    });
    text(ctx, 'agents', 30, 276, { chars: P(tt, 0.8, 1.3) });

    // the single gate
    fade(ctx, E(tt, 1.2, 1.9), () => {
      box(ctx, GX - 16, GY - 46, 32, 92, 8, pal.ink);
      seg(ctx, GX, GY - 30, GX, GY - 10, 1, pal.muted);
      seg(ctx, GX, GY + 10, GX, GY + 30, 1, pal.muted);
      circle(ctx, GX, GY, 4, pal.ink);
    });
    text(ctx, 'gateway', GX, 216, { align: 'center', chars: P(tt, 1.6, 2.1) });

    // one line out, then the trace
    path(ctx, [[GX + 16, GY], [246, GY]], E(tt, 3.4, 3.9), pal.muted);
    const spans = [[246, 96, 112], [262, 118, 60], [262, 140, 84], [286, 162, 40], [286, 184, 70]];
    const live = tt > 5.6;
    fade(ctx, E(tt, 3.7, 4.3), () => seg(ctx, 246, 82, 246, 198, 1, pal.faint));
    spans.forEach(([x, y, wd], i) => {
      const k = E(tt, 3.9 + i * 0.3, 4.6 + i * 0.3);
      const c = i === 0 ? (live ? pal.accent : pal.ink) : pal.muted;
      fade(ctx, k > 0 ? 1 : 0, () => {
        ctx.save();
        ctx.lineWidth *= 3;
        seg(ctx, x + 2, y, x + 2 + wd * k, y, 1, c);
        ctx.restore();
      });
    });
    pulse(ctx, 252, 222, tt, 5.6);
    text(ctx, 'one trace', 262, 222, { color: pal.accent, chars: P(tt, 5.6, 6.1) });
  });
}
