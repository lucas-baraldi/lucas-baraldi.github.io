// Legal-ops agent: three marks on a clock -> browser outline -> route through a pin in Brazil -> check.
import { stage, pal, E, P, fade, circle, dot, path, seg, box, text, check, along, pulse } from './kit.js';

const MARKS = [-150, -30, 90].map(d => (d * Math.PI) / 180);

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    const cx = 78, cy = 84, r = 38;

    // clock with three daily marks
    fade(ctx, E(tt, 0.2, 0.8), () => {
      circle(ctx, cx, cy, r, pal.faint);
      const hand = -Math.PI / 2 + Math.PI * 2 * E(tt, 0.4, 2.2);
      seg(ctx, cx, cy, cx + Math.cos(hand) * (r - 12), cy + Math.sin(hand) * (r - 12), 1, pal.muted);
      dot(ctx, cx, cy, 2, pal.muted);
    });
    MARKS.forEach((a, i) => {
      const k = E(tt, 0.7 + i * 0.5, 1.2 + i * 0.5);
      fade(ctx, k, () => {
        seg(ctx, cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6), cx + Math.cos(a) * (r + 6), cy + Math.sin(a) * (r + 6), 1, pal.ink);
        dot(ctx, cx + Math.cos(a) * (r + 12), cy + Math.sin(a) * (r + 12), 2, pal.ink);
      });
    });
    text(ctx, 'three runs a day', 40, 146, { chars: P(tt, 1.2, 2.0) });

    // browser outline
    fade(ctx, E(tt, 1.9, 2.6), () => {
      box(ctx, 216, 40, 150, 104, 8);
      seg(ctx, 216, 60, 366, 60);
      [0, 1, 2].forEach(i => circle(ctx, 228 + i * 9, 50, 2, pal.muted));
      seg(ctx, 232, 78, 330, 78, P(tt, 2.4, 3.0), pal.faint);
      seg(ctx, 232, 92, 300, 92, P(tt, 2.5, 3.1), pal.faint);
      seg(ctx, 232, 106, 316, 106, P(tt, 2.6, 3.2), pal.faint);
    }, 8);
    text(ctx, 'portal', 216, 158, { chars: P(tt, 2.3, 2.8) });

    // route: cloud abroad -> pin in Brazil -> portal
    const route = [[60, 232], [150, 232], [196, 232], [290, 232], [290, 146]];
    fade(ctx, E(tt, 2.8, 3.3), () => {
      box(ctx, 34, 216, 52, 32, 6, pal.muted);
      text(ctx, 'cloud', 60, 232, { size: 8, align: 'center' });
    });
    const rk = E(tt, 3.3, 5.0);
    path(ctx, [[86, 232], ...route.slice(1)], rk, pal.muted, [3, 4]);
    // the pin
    const pk = E(tt, 3.8, 4.4);
    fade(ctx, pk, () => {
      const px = 196, py = 232 - 14;
      ctx.beginPath();
      ctx.arc(px, py - 8, 8, Math.PI * 0.85, Math.PI * 0.15);
      ctx.lineTo(px, py + 8);
      ctx.closePath();
      ctx.strokeStyle = pal.ink;
      ctx.stroke();
      dot(ctx, px, py - 8, 2, pal.ink);
    }, -10);
    text(ctx, 'proxy in brazil', 160, 258, { chars: P(tt, 4.0, 4.7) });
    if (rk > 0 && rk < 1) {
      const [x, y] = along([[86, 232], ...route.slice(1)], rk);
      dot(ctx, x, y, 2.5, pal.ink);
    }

    // accepted
    const ck = E(tt, 5.1, 5.7);
    fade(ctx, ck, () => circle(ctx, 340, 118, 12, pal.accent));
    check(ctx, 340, 118, 12, ck);
    pulse(ctx, 362, 158, tt, 5.6);
    text(ctx, 'checked', 352, 158, { color: pal.accent, align: 'right', chars: P(tt, 5.5, 6.0) });
  });
}
