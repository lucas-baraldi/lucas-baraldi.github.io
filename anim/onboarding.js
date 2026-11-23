// Partner onboarding: message bubble -> agent node -> a new row lands in a table.
import { stage, pal, E, P, fade, bubble, bars, circle, dot, path, seg, box, text, pulse } from './kit.js';

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    // incoming message
    fade(ctx, E(tt, 0.3, 0.9), () => {
      bubble(ctx, 34, 40, 118, 44, pal.ink, 'left');
      bars(ctx, 48, 55, [78, 52], 12, P(tt, 0.6, 1.5), pal.muted);
    }, 8);
    text(ctx, 'partner', 34, 106, { chars: P(tt, 0.7, 1.2) });

    // message -> agent
    path(ctx, [[152, 62], [214, 62]], E(tt, 1.4, 2.0), pal.muted);
    fade(ctx, E(tt, 1.7, 2.3), () => {
      circle(ctx, 236, 62, 22);
      text(ctx, 'agent', 236, 62, { size: 9, color: pal.ink, align: 'center' });
    });
    // thinking arc
    if (tt > 2.2 && tt < 3.4) {
      const a = (tt - 2.2) * 5;
      ctx.beginPath();
      ctx.arc(236, 62, 28, a, a + 1.4);
      ctx.strokeStyle = pal.muted;
      ctx.stroke();
    }

    // agent -> table
    path(ctx, [[236, 84], [236, 112], [200, 112], [200, 134]], E(tt, 3.2, 3.9), pal.muted);

    // table
    fade(ctx, E(tt, 0.5, 1.2), () => {
      box(ctx, 46, 134, 308, 124, 8, pal.faint);
      seg(ctx, 46, 158, 354, 158, 1, pal.faint);
      text(ctx, 'crm', 60, 146, { size: 8 });
      [0, 1].forEach(i => {
        const y = 174 + i * 22;
        dot(ctx, 62, y, 2, pal.muted);
        bars(ctx, 76, y, [70], 0, 1, pal.faint);
        seg(ctx, 170, y, 240, y, 1, pal.faint);
        seg(ctx, 266, y, 322, y, 1, pal.faint);
      });
    });

    // the new row
    const k = E(tt, 3.9, 4.7);
    const live = tt > 4.6;
    fade(ctx, k, () => {
      const y = 218;
      const c = live ? pal.accent : pal.ink;
      box(ctx, 54, y - 12, 292, 24, 5, c);
      seg(ctx, 76, y, 146, y, P(tt, 4.2, 4.8), pal.ink);
      seg(ctx, 170, y, 240, y, P(tt, 4.4, 5.0), pal.ink);
      seg(ctx, 266, y, 322, y, P(tt, 4.6, 5.2), pal.ink);
    }, 10);
    pulse(ctx, 62, 218, tt, 4.7);
    text(ctx, 'candidate registered', 54, 246, { color: pal.accent, chars: P(tt, 4.9, 5.6) });
  });
}
