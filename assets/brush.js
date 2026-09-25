'use strict';
// Marker-and-cut-out brush: shapes are filled flat, outlined with a slightly
// uneven felt-tip line, and share one paper texture. Points may carry a third
// value 1 to mark a sharp corner; other points are smoothed through.

const FONT = {serif: '"Hoefler Text", Palatino, Georgia, serif', khmer: '"Khmer MN", "Khmer Sangam MN", "Noto Sans Khmer", serif', hand: '"Chalkboard", "Comic Sans MS", cursive'};
const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
const len = a => Math.hypot(a[0], a[1]), norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const rot = (p, a, o = [0, 0]) => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * c - y * s, o[1] + x * s + y * c]; };
const xf = (pts, x, y, s = 1, a = 0, fx = 1) => pts.map(p => { const r = rot([p[0] * s * fx, p[1] * s], a), q = [x + r[0], y + r[1]]; if (p.length > 2) q[2] = p[2]; return q; });
const rectP = (x, y, w, h) => [[x, y, 1], [x + w, y, 1], [x + w, y + h, 1], [x, y + h, 1]];
const ell = (cx, cy, rx, ry, n = 28, a0 = 0, a1 = TAU) => Array.from({length: n}, (_, i) => { const a = lerp(a0, a1, i / (a1 - a0 >= TAU - 1e-6 ? n : n - 1)); return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
const circ = (x, y, r, n = 26) => ell(x, y, r, r, n);
// rr: rounded rectangle as a point list.
const rr = (x, y, w, h, r = 12) => { r = Math.min(r, w / 2, h / 2); const k = r * .45; return [[x + r, y], [x + w - r, y], [x + w - k, y + k * .1], [x + w, y + r], [x + w, y + h - r], [x + w - k * .1, y + h - k], [x + w - r, y + h], [x + r, y + h], [x + k, y + h - k * .1], [x, y + h - r], [x, y + r], [x + k * .1, y + k]]; };
// curve: smooth through points, breaking at corners (third value 1).
function curve(pts, close = false, step = 2.5) {
  const n = pts.length; if (n < 2) return pts.map(p => [p[0], p[1]]);
  const corner = pts.map((p, i) => p[2] === 1 || (!close && (i === 0 || i === n - 1)));
  if (!corner.some(Boolean)) return smoothLine(pts.map(p => [p[0], p[1]]), step, close);
  const start = corner.indexOf(true), total = close ? n : n - 1 - start, runs = []; let run = [pts[start]];
  for (let k = 1; k <= total; k++) { const i = (start + k) % n, p = pts[i]; run.push(p); if (corner[i] || k === total) { runs.push(run); run = [p]; } }
  const out = []; for (const r of runs) { const s = smoothLine(r.map(p => [p[0], p[1]]), step, false); if (out.length) s.shift(); out.push(...s); } return out;
}
function cumLen(q) { const L = [0]; for (let i = 1; i < q.length; i++) L.push(L[i - 1] + Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1])); return L; }
// cutAt: the first fraction u of a polyline (for things that draw themselves on).
function cutAt(q, u) { if (u >= 1) return q; if (u <= 0) return [q[0]]; const L = cumLen(q), T = L[L.length - 1] * u, out = [q[0]]; for (let i = 1; i < q.length; i++) { if (L[i] <= T) out.push(q[i]); else { out.push(lerp2(q[i - 1], q[i], (T - L[i - 1]) / ((L[i] - L[i - 1]) || 1))); break; } } return out; }
const profile = keys => u => { if (u <= keys[0][0]) return keys[0][1]; for (let k = 1; k < keys.length; k++) if (u <= keys[k][0]) return lerp(keys[k - 1][1], keys[k][1], (u - keys[k - 1][0]) / (keys[k][0] - keys[k - 1][0])); return keys[keys.length - 1][1]; };
// strip: a ribbon along a path with an authored width profile (limbs, roots, ropes).
function strip(pts, wf, smooth = true, step = 2.5) {
  const q = smooth && pts.length > 2 ? smoothLine(pts, step, false) : pts, n = q.length, L = cumLen(q), T = L[n - 1] || 1, A = [], B = [];
  for (let i = 0; i < n; i++) { const a = q[Math.max(0, i - 1)], b = q[Math.min(n - 1, i + 1)], d = norm(sub(b, a)), w = wf(L[i] / T) / 2; A.push([q[i][0] - d[1] * w, q[i][1] + d[0] * w]); B.push([q[i][0] + d[1] * w, q[i][1] - d[0] * w]); }
  return [...A, ...B.reverse()];
}
// inkLine: a filled ribbon whose width follows a taper and a slow seeded wobble.
const TAPER_OPEN = [[0, .7], [.08, 1], [.92, 1], [1, .7]];
function inkLine(c, pts, {w = 5, color = '#1b1512', al = 1, taper = TAPER_OPEN, seed = 1, close = false, v = .12, raw = false} = {}) {
  const q = raw ? pts : curve(pts, close); if (q.length < 2) return;
  const L = cumLen(q), T = L[L.length - 1] || 1, left = [], right = [], prof = profile(taper);
  for (let i = 0; i < q.length; i++) { const a = q[Math.max(0, i - 1)], b = q[Math.min(q.length - 1, i + 1)], d = norm(sub(b, a)), ww = w * (close ? 1 : prof(L[i] / T)) * (1 + v * wobble(L[i] / 34, seed)) / 2; left.push([q[i][0] - d[1] * ww, q[i][1] + d[0] * ww]); right.push([q[i][0] + d[1] * ww, q[i][1] - d[0] * ww]); }
  c.save(); c.globalAlpha *= al; c.fillStyle = color; c.beginPath();
  if (close) { left.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); right.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill('evenodd'); }
  else { left.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); for (let i = right.length - 1; i >= 0; i--) c.lineTo(right[i][0], right[i][1]); c.closePath(); c.fill(); }
  c.restore();
}
function bbox(q) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of q) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0, y0, x1 - x0, y1 - y0]; }
const vgrad = (top, bottom) => (c, p, q) => { const [, y, , h] = bbox(q), g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, top); g.addColorStop(1, bottom); c.fillStyle = g; c.fill(p); };
const hgrad = (a, b) => (c, p, q) => { const [x, , w] = bbox(q), g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fill(p); };
// Paper texture, tiled, laid over every fill in screen space (the paper under the paint).
let _paper = null;
function paperPattern(c) {
  if (!_paper) { const cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d'), r = rng(31); g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 60; i++) { const x = r() * 512, y = r() * 512, R = 20 + r() * 90, a = .05 + r() * .08; for (const dx of [-512, 0, 512]) for (const dy of [-512, 0, 512]) { const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, R); gr.addColorStop(0, `rgba(120,90,60,${a})`); gr.addColorStop(1, 'rgba(120,90,60,0)'); g.fillStyle = gr; g.fillRect(x - R + dx, y - R + dy, R * 2, R * 2); } }
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(80,60,40,${r() * .07})`; g.fillRect(r() * 512, r() * 512, 1 + r() * 2, 1 + r()); }
    _paper = cv; }
  return c.createPattern(_paper, 'repeat');
}
function texture(c, path, k = .55) { c.save(); c.clip(path); c.globalCompositeOperation = 'multiply'; c.globalAlpha *= k; resetT(c); c.fillStyle = paperPattern(c); c.fillRect(0, 0, W, H); c.restore(); }
// ---------- styles ----------
// Every shape and stroke goes through sh() and mk(), so one switch restyles the
// whole film. 'wash' (default): flat colour with a light watercolour mottle and a thin
// ink outline, over soft outline-free watercolour scenery. 'haze': a painted
// animation-background look, muted sage and dusty earth, flat colour with a soft cel
// shade (lit from the upper right) and a thin warm-brown ink line, over misty layered
// forests. 'paper': torn-edge coloured paper with real drop shadows, no outlines.
// 'marker': thick felt-tip outlines.
let STYLE = 'wash', INK = '#1d1a1c', LINE = 5.2;
const STYLES = {
  wash: {ink: '#1d1a1c', line: 5.2, font: '"Chalkboard SE", "Comic Neue", "Avenir Next", sans-serif'},
  haze: {ink: '#3a3024', line: 5.2, font: '"Avenir Next", "Trebuchet MS", "Helvetica Neue", sans-serif'},
  paper: {ink: '#3a2a22', line: 5.2, font: '"Avenir Next", Avenir, "Helvetica Neue", sans-serif'},
  marker: {ink: '#1b1512', line: 5.2, font: FONT.serif},
};
function useStyle(name) { if (!STYLES[name]) throw new Error(`unknown style "${name}"`); STYLE = name; INK = STYLES[name].ink; LINE = STYLES[name].line; FONT.ui = STYLES[name].font; if (typeof T !== 'undefined' && typeof PALETTES !== 'undefined') Object.assign(T, PALETTES[name]); }
FONT.ui = STYLES.wash.font;

// Deckled paper edge: the outline is nudged in and out along its length. The pattern
// follows arc length, not position, so a moving cut-out keeps the same torn edge.
function deckle(q, amp = 1.3) {
  const L = cumLen(q), n = q.length, out = [];
  for (let i = 0; i < n; i++) { const a = q[Math.max(0, i - 1)], b = q[Math.min(n - 1, i + 1)], d = norm(sub(b, a)), o = amp * (wobble(L[i] / 7, 5) * .7 + wobble(L[i] / 2.3, 9) * .3); out.push([q[i][0] - d[1] * o, q[i][1] + d[0] * o]); }
  return out;
}
// The paper look: soft cast shadow (light from the upper left), the colour, fibre
// texture, then a pale cut edge on the lit side and a darker one in shade.
function paperFill(c, p, fill, q, al, lift = 1) {
  c.save(); c.globalAlpha *= al;
  c.shadowColor = `rgba(58,36,20,${.28 * lift})`; c.shadowBlur = 7 * S * lift; c.shadowOffsetX = 3 * S * lift; c.shadowOffsetY = 5 * S * lift;
  if (typeof fill === 'function') fill(c, p, q); else { c.fillStyle = fill; c.fill(p); }
  c.shadowColor = 'transparent';
  texture(c, p, .5);
  c.save(); c.clip(p); c.lineWidth = 3;
  c.save(); c.translate(1.4, 1.6); c.strokeStyle = 'rgba(255,250,238,.55)'; c.stroke(p); c.restore();
  c.save(); c.translate(-1.2, -1.4); c.strokeStyle = 'rgba(60,35,20,.22)'; c.stroke(p); c.restore();
  c.restore(); c.restore();
}
// Watercolour mottle: soft pigment pooling, tiled; laid over fills in the wash style.
let _mottle = null;
function mottlePattern(c) {
  if (!_mottle) { const cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d'), r = rng(47); g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512);
    // Large, faint, soft-centred blooms (no hard rings) and a whisper of grain.
    for (let i = 0; i < 26; i++) { const x = r() * 512, y = r() * 512, R = 60 + r() * 140, a = .025 + r() * .04; for (const dx of [-512, 0, 512]) for (const dy of [-512, 0, 512]) { const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, R); gr.addColorStop(0, `rgba(90,75,70,${a})`); gr.addColorStop(1, 'rgba(90,75,70,0)'); g.fillStyle = gr; g.fillRect(x - R + dx, y - R + dy, R * 2, R * 2); } }
    for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(70,60,55,${r() * .035})`; g.fillRect(r() * 512, r() * 512, 1 + r() * 1.5, 1 + r()); }
    _mottle = cv; }
  return c.createPattern(_mottle, 'repeat');
}
function mottle(c, path, k = .4) { c.save(); c.clip(path); c.globalCompositeOperation = 'multiply'; c.globalAlpha *= k; resetT(c); c.fillStyle = mottlePattern(c); c.fillRect(0, 0, W, H); c.restore(); }
// Cel shade for the haze style: the side away from the light (upper right) is dimmed
// by a soft multiply gradient, with a whisper of grain so flat fills don't look digital.
function celShade(c, p, q, k = 1) {
  const [x, y, w, h] = bbox(q), g = c.createLinearGradient(x + w, y, x + w * .25, y + h);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(74,84,66,${.34 * k})`);
  c.save(); c.clip(p); c.globalCompositeOperation = 'multiply'; c.fillStyle = g; c.fillRect(x - 2, y - 2, w + 4, h + 4); c.restore();
  mottle(c, p, .16 * k);
}
// sh: a cut-out shape. Options: w (outline width, marker style), tex, line, al, color, lift (shadow depth, paper style).
function sh(c, pts, fill, {w = LINE, tex = true, line = true, al = 1, color = INK, lift = 1} = {}) {
  if (STYLE === 'haze') {
    const q = curve(pts, true), p = polyPath(q, true);
    c.save(); c.globalAlpha *= al;
    if (typeof fill === 'function') fill(c, p, q); else if (fill) { c.fillStyle = fill; c.fill(p); }
    if (tex && fill) celShade(c, p, q, .8);
    c.restore();
    if (line && w > 0) inkLine(c, q, {w: w * .46, close: true, raw: true, al: al * .92, color, v: .16});
    return p;
  }
  if (STYLE === 'wash') {
    const q = curve(pts, true), p = polyPath(q, true);
    c.save(); c.globalAlpha *= al;
    if (typeof fill === 'function') fill(c, p, q); else if (fill) { c.fillStyle = fill; c.fill(p); }
    if (tex && fill) mottle(c, p);
    c.restore();
    if (line && w > 0) inkLine(c, q, {w: w * .62, close: true, raw: true, al, color, v: .1});
    return p;
  }
  if (STYLE === 'paper') {
    const q = deckle(curve(pts, true)), p = polyPath(q, true);
    if (fill) paperFill(c, p, fill, q, al, tex ? lift : lift * .6);
    else if (line && w > 0) inkLine(c, q, {w: w * .55, close: true, raw: true, al, color});
    return p;
  }
  const q = curve(pts, true), p = polyPath(q, true);
  c.save(); c.globalAlpha *= al;
  if (typeof fill === 'function') fill(c, p, q); else if (fill) { c.fillStyle = fill; c.fill(p); }
  if (tex && fill) texture(c, p);
  c.restore();
  if (line && w > 0) inkLine(c, q, {w, close: true, raw: true, al, color});
  return p;
}
// mk: an open stroke. Paper style: a narrow paper strip (ink-dark details are drawn
// finer, like cut dark card); marker style: a felt-tip line.
function mk(c, pts, {w = LINE, color = INK, al = 1, close = false, raw = false} = {}) {
  if (STYLE === 'haze') { inkLine(c, pts, {w: w * .5, color, al: al * .92, close, raw, v: .16}); return; }
  if (STYLE === 'wash') { inkLine(c, pts, {w: w * .62, color, al, close, raw, v: .1}); return; }
  if (STYLE === 'paper') {
    const dark = color === INK || color === '#1b1512' || color === '#3a2a22';
    c.save(); c.shadowColor = 'rgba(58,36,20,.25)'; c.shadowBlur = 3 * S; c.shadowOffsetX = 1.5 * S; c.shadowOffsetY = 2.5 * S;
    inkLine(c, pts, {w: dark ? w * .62 : w, color: dark ? INK : color, al, close, raw, v: .05});
    c.restore(); return;
  }
  inkLine(c, pts, {w, color, al, close, raw});
}

// A brass split-pin, the fastener of a paper puppet's joint (paper style only).
function pin(c, p, r = 4.2) {
  if (STYLE !== 'paper') return;
  c.save(); c.shadowColor = 'rgba(58,36,20,.35)'; c.shadowBlur = 2 * S; c.shadowOffsetX = 1 * S; c.shadowOffsetY = 1.5 * S;
  const g = c.createRadialGradient(p[0] - r * .35, p[1] - r * .35, r * .1, p[0], p[1], r); g.addColorStop(0, '#fff1b8'); g.addColorStop(.5, '#d9a93e'); g.addColorStop(1, '#8a6120');
  c.fillStyle = g; c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.fill(); c.restore();
}
