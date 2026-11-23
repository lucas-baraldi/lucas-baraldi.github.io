// VisionEPI: a line figure, detection boxes for helmet, vest and gloves, a danger zone, a structured readout.
import { stage, pal, E, P, fade, circle, dot, path, seg, box, text, check, pulse } from './kit.js';

const JOINTS = { head: [150, 78], neck: [150, 98], lsh: [128, 106], rsh: [172, 106], lel: [116, 138], rel: [186, 136], lha: [112, 168], rha: [196, 164], hip: [150, 168], lkn: [138, 208], rkn: [162, 208], lft: [134, 246], rft: [168, 246] };
const BONES = [['neck', 'lsh'], ['neck', 'rsh'], ['lsh', 'lel'], ['lel', 'lha'], ['rsh', 'rel'], ['rel', 'rha'], ['neck', 'hip'], ['hip', 'lkn'], ['lkn', 'lft'], ['hip', 'rkn'], ['rkn', 'rft']];

function detect(ctx, x, y, w, h, label, k, live, side = 'top') {
  if (k <= 0) return;
  const c = live ? pal.accent : pal.ink;
  path(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], k, c);
  if (side === 'left') text(ctx, label, x - 8, y + 8, { color: c, chars: k, align: 'right' });
  else if (side === 'bottom') text(ctx, label, x + w / 2, y + h + 10, { color: c, chars: k, align: 'center' });
  else text(ctx, label, x, y - 8, { color: c, chars: k });
}

export function renderAt(ctx, w, h, t) {
  stage(ctx, w, h, t, tt => {
    // frame of the camera
    fade(ctx, E(tt, 0.1, 0.7), () => {
      [[34, 34, 1, 1], [262, 34, -1, 1], [34, 266, 1, -1], [262, 266, -1, -1]].forEach(([x, y, sx, sy]) =>
        path(ctx, [[x + 12 * sx, y], [x, y], [x, y + 12 * sy]], 1, pal.muted));
    });
    // danger zone on the floor
    const zk = E(tt, 2.8, 3.5);
    fade(ctx, zk, () => {
      path(ctx, [[206, 262], [226, 222], [262, 222], [262, 262], [206, 262]], 1, pal.muted, [3, 4]);
      text(ctx, 'zone', 232, 244, { size: 8 });
    });

    // the worker
    fade(ctx, E(tt, 0.3, 1.0), () => {
      circle(ctx, ...JOINTS.head, 13);
      ctx.beginPath();
      ctx.arc(JOINTS.head[0], JOINTS.head[1] - 2, 17, Math.PI * 1.02, Math.PI * 1.98);
      ctx.strokeStyle = pal.ink;
      ctx.stroke();
      seg(ctx, 130, 76, 170, 76);
      BONES.forEach(([a, b]) => seg(ctx, ...JOINTS[a], ...JOINTS[b]));
      path(ctx, [[134, 108], [134, 160], [166, 160], [166, 108]], 1, pal.muted);
    });
    // pose keypoints
    Object.values(JOINTS).forEach(([x, y], i) => fade(ctx, E(tt, 2.0 + i * 0.05, 2.4 + i * 0.05), () => dot(ctx, x, y, 2.2, pal.ink)));

    const live = tt > 5.4;
    detect(ctx, 126, 54, 48, 34, 'helmet', E(tt, 1.0, 1.6), live);
    detect(ctx, 124, 100, 52, 66, 'vest', E(tt, 1.4, 2.0), live, 'left');
    detect(ctx, 100, 156, 24, 24, 'gloves', E(tt, 1.8, 2.4), live, 'bottom');
    detect(ctx, 184, 152, 24, 24, '', E(tt, 1.9, 2.5), live);

    // structured readout
    fade(ctx, E(tt, 3.6, 4.2), () => box(ctx, 284, 60, 92, 124, 8, pal.faint), 8);
    ['helmet', 'vest', 'gloves', 'posture'].forEach((s, i) => {
      const t0 = 4.0 + i * 0.35;
      const y = 82 + i * 26;
      text(ctx, s, 296, y, { size: 8, chars: P(tt, t0, t0 + 0.3) });
      check(ctx, 362, y, 7, E(tt, t0 + 0.3, t0 + 0.7), live ? pal.accent : pal.ink);
    });
    pulse(ctx, 284, 206, tt, 5.5);
    text(ctx, 'risk analysis', 294, 206, { color: pal.accent, chars: P(tt, 5.5, 6.1) });
  });
}
