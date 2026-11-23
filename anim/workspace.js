// Executive workspace: a phone sends a command -> a box in the cloud runs it -> the result comes back.
import { stage, pal, E, P, fade, dot, path, seg, box, text, check, along, pulse } from './kit.js';

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    // phone
    fade(ctx, E(tt, 0.2, 0.9), () => {
      box(ctx, 48, 60, 84, 168, 14);
      seg(ctx, 78, 72, 102, 72, 1, pal.muted);
    }, 8);
    text(ctx, '> run it', 60, 110, { color: pal.ink, chars: P(tt, 0.9, 1.7) });
    fade(ctx, E(tt, 1.6, 2.0) * (1 - P(tt, 5.0, 5.3)), () => seg(ctx, 60, 126, 104, 126, 1, pal.faint));
    text(ctx, 'phone', 48, 246, { chars: P(tt, 0.6, 1.1) });

    // command goes up
    const up = [[132, 110], [196, 110], [232, 110]];
    path(ctx, up, E(tt, 1.8, 2.4), pal.faint);
    const pu = P(tt, 1.9, 2.6);
    if (pu > 0 && pu < 1) { const [x, y] = along(up, pu); dot(ctx, x, y, 2.5, pal.ink); }

    // box in the cloud
    fade(ctx, E(tt, 0.5, 1.2), () => {
      ctx.beginPath();
      ctx.arc(262, 62, 12, Math.PI, Math.PI * 1.9);
      ctx.arc(284, 54, 16, Math.PI * 1.15, Math.PI * 1.95);
      ctx.arc(308, 62, 11, Math.PI * 1.3, Math.PI * 2);
      ctx.strokeStyle = pal.muted;
      ctx.stroke();
      box(ctx, 232, 74, 124, 104, 8);
    }, 8);
    [0, 1, 2, 3].forEach(i => {
      const t0 = 2.6 + i * 0.45;
      const y = 94 + i * 20;
      text(ctx, '$', 244, y, { color: pal.muted, chars: P(tt, t0, t0 + 0.1) });
      seg(ctx, 258, y, 258 + [70, 48, 82, 36][i], y, P(tt, t0, t0 + 0.5), i === 3 ? pal.ink : pal.faint);
    });
    text(ctx, 'cloud workspace', 232, 196, { chars: P(tt, 1.0, 1.7) });

    // result comes back
    const down = [[232, 160], [196, 160], [132, 160]];
    path(ctx, down, E(tt, 4.5, 5.1), pal.faint);
    const pd = P(tt, 4.6, 5.3);
    if (pd > 0 && pd < 1) { const [x, y] = along(down, pd); dot(ctx, x, y, 2.5, pal.accent); }

    const ck = E(tt, 5.3, 5.9);
    fade(ctx, ck, () => box(ctx, 58, 142, 64, 36, 7, pal.accent), 6);
    check(ctx, 76, 160, 10, ck);
    text(ctx, 'done', 90, 160, { color: pal.accent, chars: P(tt, 5.6, 6.0) });
    pulse(ctx, 90, 204, tt, 5.8);
  });
}
