// HR operations: a document comes in -> fields are read -> check -> message bubble.
import { stage, pal, E, P, fade, lerp, bubble, bars, path, seg, box, text, check, pulse } from './kit.js';

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    ctx.translate(0, 18);
    // document slides in
    const dk = E(tt, 0.2, 1.0);
    const dx = lerp(-10, 40, dk);
    const fields = [0, 1, 2, 3];
    fade(ctx, dk, () => {
      ctx.beginPath();
      ctx.moveTo(dx, 52); ctx.lineTo(dx + 78, 52); ctx.lineTo(dx + 98, 72); ctx.lineTo(dx + 98, 196); ctx.lineTo(dx, 196);
      ctx.closePath();
      ctx.strokeStyle = pal.ink;
      ctx.stroke();
      path(ctx, [[dx + 78, 52], [dx + 78, 72], [dx + 98, 72]], 1, pal.ink);
      fields.forEach(i => {
        const y = 96 + i * 24;
        const read = tt > 1.6 + i * 0.5;
        seg(ctx, dx + 14, y, dx + 44, y, 1, pal.muted);
        seg(ctx, dx + 14, y + 8, dx + 80, y + 8, 1, read ? pal.ink : pal.faint);
      });
    });
    text(ctx, 'invoice', 40, 212, { chars: P(tt, 0.8, 1.3) });

    // reading line
    if (tt > 1.4 && tt < 3.6) {
      const y = lerp(88, 188, P(tt, 1.4, 3.6));
      seg(ctx, 34, y, 144, y, 1, pal.ink);
    }

    // extracted fields
    fields.forEach(i => {
      const t0 = 1.7 + i * 0.5;
      const y = 100 + i * 24;
      path(ctx, [[146, y], [176, y]], E(tt, t0, t0 + 0.4), pal.faint);
      fade(ctx, E(tt, t0 + 0.2, t0 + 0.7), () => {
        box(ctx, 178, y - 9, 74, 18, 5, pal.muted);
        bars(ctx, 188, y, [34], 0, 1, pal.ink);
      }, 6);
      check(ctx, 240, y, 7, E(tt, t0 + 0.6, t0 + 1.0), pal.ink);
    });
    text(ctx, 'validated', 178, 212, { chars: P(tt, 3.6, 4.1) });

    // result goes to the team
    path(ctx, [[254, 136], [282, 136]], E(tt, 4.0, 4.5), pal.muted);
    const bk = E(tt, 4.4, 5.1);
    fade(ctx, bk, () => {
      bubble(ctx, 284, 108, 86, 52, tt > 5.0 ? pal.accent : pal.ink, 'right');
      bars(ctx, 296, 124, [48, 30], 12, P(tt, 4.8, 5.5), pal.muted);
    }, 8);
    pulse(ctx, 284, 190, tt, 5.2);
    text(ctx, 'sent to the team', 294, 190, { color: pal.accent, chars: P(tt, 5.3, 6.0) });
  });
}
