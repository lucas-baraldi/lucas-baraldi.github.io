// Short-video engine: a script -> frames -> three outputs on a schedule.
import { stage, pal, E, P, fade, bars, circle, dot, path, seg, box, text, along, pulse } from './kit.js';

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    // script
    fade(ctx, E(tt, 0.2, 0.9), () => box(ctx, 34, 84, 80, 120, 7), 8);
    bars(ctx, 46, 102, [52, 40, 56, 32, 48, 38], 15, P(tt, 0.6, 2.0), pal.muted);
    text(ctx, 'script', 34, 222, { chars: P(tt, 0.6, 1.1) });

    path(ctx, [[114, 144], [146, 144]], E(tt, 1.8, 2.3), pal.faint);

    // frames
    [0, 1, 2].forEach(i => {
      const t0 = 2.1 + i * 0.35;
      const x = 150 + i * 14, y = 96 - i * 8;
      fade(ctx, E(tt, t0, t0 + 0.6), () => {
        ctx.save();
        ctx.fillStyle = pal.surface;
        ctx.fillRect(x, y, 56, 100);
        ctx.restore();
        box(ctx, x, y, 56, 100, 6, i === 2 ? pal.ink : pal.muted);
      }, 10);
    });
    fade(ctx, E(tt, 3.1, 3.6), () => {
      path(ctx, [[198, 120], [198, 140], [214, 130], [198, 120]], 1, pal.ink);
      seg(ctx, 188, 164, 224, 164, 1, pal.faint);
      seg(ctx, 188, 164, 188 + 36 * P(tt, 3.4, 4.6), 164, 1, pal.ink);
    });
    text(ctx, 'frames', 150, 222, { chars: P(tt, 2.4, 2.9) });

    // three outputs
    const live = tt > 5.7;
    [0, 1, 2].forEach(i => {
      const y = 78 + i * 62;
      const line = [[236, 136], [262, 136], [282, y + 16], [304, y + 16]];
      const t0 = 4.0 + i * 0.25;
      path(ctx, line, E(tt, t0, t0 + 0.6), pal.faint);
      const p = P(tt, t0 + 0.3, t0 + 1.0);
      if (p > 0 && p < 1) { const [x, yy] = along(line, p); dot(ctx, x, yy, 2.2, pal.ink); }
      fade(ctx, E(tt, t0 + 0.5, t0 + 1.1), () => {
        box(ctx, 306, y, 60, 32, 7, live ? pal.accent : pal.ink);
        // clock mark: scheduled
        circle(ctx, 322, y + 16, 6, pal.muted);
        path(ctx, [[322, y + 12], [322, y + 16], [325, y + 18]], 1, pal.muted);
        seg(ctx, 336, y + 16, 356, y + 16, 1, pal.faint);
      }, 6);
    });
    pulse(ctx, 300, 262, tt, 5.8);
    text(ctx, 'scheduled', 310, 262, { color: pal.accent, chars: P(tt, 5.8, 6.3) });
  });
}
