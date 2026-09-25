'use strict';
// Action storytelling: players show what happens instead of a presenter telling it.
// Timing helpers take absolute scene times (tau) so beats line up with voice lines:
// travel/hop move things, bubble/emote give players thoughts and feelings,
// impact/speedLines/dust sell a movement, shake moves the camera on a hit.

// travel: position between two points over [t0, t1], eased (default ease in-out).
const travel = (tau, t0, t1, a, b, e = easeInOutSine) => lerp2(a, b, e(clamp((tau - t0) / (t1 - t0), 0, 1)));
// hop: arc jump from a to b, peaking `h` units above the straight line.
function hop(tau, t0, t1, a, b, h = 120) { const u = clamp((tau - t0) / (t1 - t0), 0, 1), p = lerp2(a, b, u); return [p[0], p[1] - h * 4 * u * (1 - u)]; }
// walking phase for pp()/elephantT(): steps follow distance so feet do not slide.
const stepPhase = (x, stride = 80) => x / stride;
// shake: camera offset for a hit at t0, decaying over d seconds.
function shake(tau, t0, amp = 14, d = .5) { const u = (tau - t0) / d; if (u < 0 || u > 1) return {dx: 0, dy: 0}; const k = amp * (1 - u); return {dx: Math.sin(tau * 70) * k, dy: Math.cos(tau * 53) * k * .7}; }

// Speech bubble (say) or thought bubble (think). `content` is text or a draw(c) function
// in the bubble's centre space (w x h). Pops in at t0, out at t1.
function bubble(c, tau, t0, t1, x, y, content, {w = 260, h = 120, tail = [-40, 90], think = false, font = FONT.serif, size = 36, fill = '#fffaf0'} = {}) {
  const p = easeOutBack(clamp((tau - t0) / .35, 0, 1)) * (1 - span(t1 - .25, t1, tau)); if (p <= 0) return;
  c.save(); c.translate(x, y); c.scale(p, p);
  if (think) for (const [k, r] of [[.35, 14], [.6, 9], [.82, 6]]) sh(c, circ(tail[0] * k, h / 2 + tail[1] * k, r, 14), fill, {w: 3.6, tex: false});
  else sh(c, [[tail[0] * .2 - 18, h / 2 - 6, 1], [tail[0], h / 2 + tail[1], 1], [tail[0] * .2 + 22, h / 2 - 6, 1]], fill, {w: LINE, tex: false});
  const box = think ? [[-w / 2, 0], [-w * .42, -h * .42], [-w * .18, -h / 2], [w * .1, -h * .52], [w * .38, -h * .44], [w / 2, -h * .05], [w * .42, h * .4], [w * .1, h / 2], [-w * .2, h * .48], [-w * .44, h * .36]] : rr(-w / 2, -h / 2, w, h, 36);
  sh(c, box, fill, {w: LINE, tex: false});
  if (typeof content === 'function') content(c, w, h);
  else { c.font = `600 ${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = INK; c.fillText(content, 0, 2); }
  c.restore();
}
// Emote over a head: '!' surprise, '?' puzzled, 'heart' love, 'sweat' worry, 'anger', 'zzz', 'idea'.
function emote(c, tau, t0, x, y, kind, {s = 1, t1 = t0 + 1.6} = {}) {
  const p = easeOutBack(clamp((tau - t0) / .3, 0, 1)) * (1 - span(t1 - .25, t1, tau)); if (p <= 0) return;
  const bob = Math.sin((tau - t0) * 6) * 4;
  c.save(); c.translate(x, y + bob); c.scale(p * s, p * s);
  if (kind === '!') { sh(c, [[-9, -64, 1], [9, -64, 1], [5, -20, 1], [-5, -20, 1]], T.red, {w: 4, tex: false}); sh(c, circ(0, -4, 9, 12), T.red, {w: 4, tex: false}); }
  if (kind === '?') { c.font = `900 70px ${FONT.serif}`; c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = 9; c.strokeStyle = INK; c.strokeText('?', 0, 0); c.fillStyle = T.yellow; c.fillText('?', 0, 0); }
  if (kind === 'heart') sh(c, [[0, 0, 1], [-26, -22], [-24, -44], [-8, -48], [0, -36, 1], [8, -48], [24, -44], [26, -22]], T.pink, {w: 4});
  if (kind === 'sweat') sh(c, [[0, -48, 1], [12, -22], [10, -8], [0, -2], [-10, -8], [-12, -22]], T.sky, {w: 4, tex: false});
  if (kind === 'anger') for (let k = 0; k < 4; k++) { c.save(); c.rotate(k * Math.PI / 2); mk(c, [[6, -6], [18, -8], [20, -20]], {w: 6, color: T.red}); c.restore(); }
  if (kind === 'zzz') { c.font = `900 40px ${FONT.serif}`; c.fillStyle = T.navy; c.fillText('z', 0, 0); c.font = `900 28px ${FONT.serif}`; c.fillText('z', 22, -24); }
  if (kind === 'idea') { sh(c, circ(0, -30, 20, 18), T.yellow, {w: 4}); sh(c, rr(-9, -12, 18, 12, 3), T.greyDk, {w: 3.4}); for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * .55; mk(c, [[Math.cos(a) * 30, -30 + Math.sin(a) * 30], [Math.cos(a) * 42, -30 + Math.sin(a) * 42]], {w: 4, color: T.gold}); } }
  c.restore();
}
// Impact burst for a hit or a landing: a spiky star with a flash.
function impact(c, tau, t0, x, y, {r = 70, col = T.yellow, d = .45} = {}) {
  const u = (tau - t0) / d; if (u < 0 || u > 1) return;
  const k = easeOut(clamp(u * 1.6, 0, 1)), R = r * (.5 + .6 * k), pts = [];
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, q = i % 2 ? R * .5 : R * (1 + .15 * hash(i, 3)); pts.push([x + Math.cos(a) * q, y + Math.sin(a) * q, 1]); }
  c.save(); c.globalAlpha = 1 - span(.6, 1, u); sh(c, pts, col, {w: LINE, tex: false}); sh(c, circ(x, y, R * .3, 14), '#fffaf0', {w: 0, tex: false}); c.restore();
}
// Speed lines trailing a moving thing (dir: +1 moving right, -1 moving left).
function speedLines(c, x, y, dir = 1, {n = 5, len = 120, spread = 90, al = .8} = {}) {
  for (let k = 0; k < n; k++) { const yy = y + (k - (n - 1) / 2) * spread / n, l = len * (.6 + hash(k, 5) * .6), x0 = x - dir * (30 + hash(k, 7) * 30); mk(c, [[x0, yy], [x0 - dir * l, yy]], {w: 4, al}); }
}
// Dust puffs kicked up at t0 (a landing, a stamp, a skid).
function dust(c, tau, t0, x, y, {n = 5, s = 1, d = .8} = {}) {
  const u = (tau - t0) / d; if (u < 0 || u > 1) return;
  for (let k = 0; k < n; k++) { const a = Math.PI + (k / (n - 1)) * Math.PI, q = 30 + u * 70; c.save(); c.globalAlpha = 1 - u; sh(c, circ(x + Math.cos(a) * q * s, y + Math.sin(a) * q * .3 * s - u * 20, (10 + u * 16) * s, 14), '#efe4cc', {w: 3.4, tex: false}); c.restore(); }
}

// ---------- weather and light ----------
// rain: thin light streaks over the whole frame (screen space), seeded, falling
// steadily; `slant` tilts them, `n` sets how heavy the rain is.
function rain(c, tau, {n = 140, al = .55, slant = .08, speed = 1400, len = 60, col = '#dfe6f5'} = {}) {
  c.save(); resetT(c); c.strokeStyle = col; c.lineCap = 'round';
  for (let k = 0; k < n; k++) { const depth = .5 + hash(k, 3) * .5, x = hash(k, 1) * (W + 200) - 100, y = ((hash(k, 2) * (H + len) + tau * speed * depth) % (H + len)) - len;
    c.globalAlpha = al * depth; c.lineWidth = 1.2 + depth * 1.6; c.beginPath(); c.moveTo(x + slant * y, y); c.lineTo(x + slant * (y + len * depth), y + len * depth); c.stroke(); }
  c.restore();
}
// glowLight: a lamp, lantern or sun glow; a bright core with a soft bloom.
function glowLight(c, x, y, r, col = '#ffe7a8', k = 1) {
  if (k <= 0) return; c.save(); c.globalCompositeOperation = 'screen';
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, alpha(col, .95 * k)); g.addColorStop(.18, alpha(col, .55 * k)); g.addColorStop(1, alpha(col, 0));
  c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
