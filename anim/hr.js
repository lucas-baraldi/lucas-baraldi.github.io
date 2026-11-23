// HR operations: a document comes in -> drops into a queue -> a message bubble tells the team.
import { stage, pal, E, P, fade, lerp, bubble, bars, path, seg, box, text, pulse } from './kit.js';

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    ctx.translate(0, 16);
    // document slides in
    const dk = E(tt, 0.2, 1.0);
    const dx = lerp(-10, 36, dk);
    fade(ctx, dk, () => {
      ctx.beginPath();
      ctx.moveTo(dx, 70); ctx.lineTo(dx + 52, 70); ctx.lineTo(dx + 70, 88); ctx.lineTo(dx + 70, 170); ctx.lineTo(dx, 170);
      ctx.closePath();
      ctx.strokeStyle = pal.ink;
      ctx.stroke();
      path(ctx, [[dx + 52, 70], [dx + 52, 88], [dx + 70, 88]], 1, pal.ink);
      bars(ctx, dx + 12, 108, [30, 46, 46, 38], 14, 1, pal.muted);
    });
    text(ctx, 'invoice', 36, 188, { chars: P(tt, 0.8, 1.3) });

    // on its way to the queue
    path(ctx, [[114, 120], [144, 120]], E(tt, 1.2, 1.7), pal.muted);

    // the queue: two items already waiting, the new one drops into the next free slot
    fade(ctx, E(tt, 0.5, 1.2), () => {
      box(ctx, 150, 56, 100, 140, 8, pal.muted);
      [168, 144].forEach(y => {
        box(ctx, 160, y, 80, 18, 5, pal.faint);
        seg(ctx, 170, y + 9, 206, y + 9, 1, pal.faint);
      });
    });
    const qk = E(tt, 1.8, 2.8);
    fade(ctx, P(tt, 1.8, 2.1), () => {
      const y = lerp(64, 120, qk);
      box(ctx, 160, y, 80, 18, 5, pal.ink);
      seg(ctx, 170, y + 9, 214, y + 9, 1, pal.ink);
    });
    text(ctx, 'queue', 150, 212, { chars: P(tt, 2.6, 3.0) });

    // the team gets a message
    path(ctx, [[254, 129], [282, 129]], E(tt, 3.2, 3.7), pal.muted);
    const bk = E(tt, 3.6, 4.3);
    fade(ctx, bk, () => {
      bubble(ctx, 284, 96, 86, 52, tt > 4.4 ? pal.accent : pal.ink, 'right');
      bars(ctx, 296, 112, [48, 30], 12, P(tt, 4.0, 4.7), pal.muted);
    }, 8);
    pulse(ctx, 284, 180, tt, 4.6);
    text(ctx, 'team notified', 294, 180, { color: pal.accent, chars: P(tt, 4.7, 5.4) });
  });
}
