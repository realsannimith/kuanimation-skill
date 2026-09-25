'use strict';
// drawtale runtime. A film is a list of scenes; every frame is a pure function of
// its index, so the renderer can draw any frame, in any order, as often as it likes.
// Logical frame: 1920 x 1080 units; the output size is picked at render time (S scales).
// Everything the page shares with the renderer lives on window.DT.

window.DT = window.DT || {};
const TAU = Math.PI * 2, W = 1920, H = 1080;
let S = 1, OUT_W = 1920, OUT_H = 1080;

// ---------- numbers ----------
const lerp = (a, b, t) => a * (1 - t) + b * t;
const clamp = (x, lo, hi) => x < lo ? lo : x > hi ? hi : x;
const lerp2 = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];

// ---------- colour (hex or rgb() strings) ----------
function parseColor(str) {
  if (str.startsWith('#')) { const h = str.length === 4 ? str.slice(1).replace(/./g, ch => ch + ch) : str.slice(1, 7); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  return str.match(/[\d.]+/g).slice(0, 3).map(Number);
}
const toHex = rgb => '#' + rgb.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
const mix = (from, to, t) => { const a = parseColor(from), b = parseColor(to); return toHex(a.map((v, i) => lerp(v, b[i], t))); };
const tint = (col, t) => mix(col, '#ffffff', t);
const shade = (col, t) => mix(col, '#000000', t);
const alpha = (col, a) => `rgba(${parseColor(col).join(',')},${a})`;

// ---------- seeded randomness: never Math.random, frames must repeat exactly ----------
// rng: a xorshift stream; hash: one integer (and a seed) to a fixed 0..1 value.
function rng(seed) { let s = (seed * 2654435761 + 1013904223) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hash(k, seed = 0) { let a = (Math.imul(k | 0, 0x27d4eb2d) ^ Math.imul((seed * 7919) | 0, 0x165667b1)) >>> 0; a ^= a >>> 15; a = Math.imul(a, 0x85ebca6b); a ^= a >>> 13; a = Math.imul(a, 0xc2b2ae35); a ^= a >>> 16; return (a >>> 0) / 4294967296; }
// wobble: smooth wandering value in -1..1, cosine-blended between hashed integer points.
function wobble(x, seed = 1) { const i = Math.floor(x), f = (1 - Math.cos((x - i) * Math.PI)) / 2; return (hash(i, seed) * (1 - f) + hash(i + 1, seed) * f) * 2 - 1; }

// ---------- easing ----------
const linear = t => t;
const easeIO = t => t < .5 ? 4 * t ** 3 : 1 - (2 - 2 * t) ** 3 / 2;
const easeIn = t => t ** 3;
const easeOut = t => 1 - (1 - t) ** 3;
const easeInOutSine = t => (1 - Math.cos(Math.PI * t)) / 2;
const easeOutExpo = t => t >= 1 ? 1 : 1 - 2 ** (-10 * t);
const easeOutBack = (t, k = 1.70158) => { const u = t - 1; return 1 + (k + 1) * u ** 3 + k * u ** 2; };

// ---------- timing ----------
// span: how far (0..1, eased) the time t is through the window [from, to].
const span = (from, to, t, ease = easeIO) => ease(clamp((t - from) / (to - from), 0, 1));
// onTwos: hold each drawing for two output frames (12 changes a second).
const onTwos = t => Math.floor(t * 12 + 1e-6) / 12;
// keys: a value (or a list of values) through keyframes [[time, value, ease?], ...].
// The ease stored on a keyframe shapes the move that leaves it.
function keys(t, frames, ease = easeIO) {
  const val = f => f[1];
  if (t <= frames[0][0]) return val(frames[0]);
  const i = frames.findIndex((f, k) => k > 0 && t < f[0]);
  if (i < 0) return val(frames[frames.length - 1]);
  const a = frames[i - 1], b = frames[i], e = typeof a[2] === 'function' ? a[2] : ease, u = e((t - a[0]) / (b[0] - a[0]));
  return Array.isArray(val(a)) ? val(a).map((v, k) => lerp(v, val(b)[k], u)) : lerp(val(a), val(b), u);
}

// ---------- geometry ----------
// smoothLine: a curve that passes through every point (cubic Hermite, tangents from
// the neighbours), sampled about every `step` units.
function smoothLine(pts, step = 5, close = false) {
  const n = pts.length;
  if (n < 3) { const [a, b] = pts, m = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); return Array.from({length: m + 1}, (_, k) => lerp2(a, b, k / m)); }
  const at = i => close ? pts[((i % n) + n) % n] : pts[clamp(i, 0, n - 1)], out = [];
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const p = at(i), q = at(i + 1), m0 = [(q[0] - at(i - 1)[0]) / 2, (q[1] - at(i - 1)[1]) / 2], m1 = [(at(i + 2)[0] - p[0]) / 2, (at(i + 2)[1] - p[1]) / 2];
    const steps = Math.max(2, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / step));
    for (let k = 0; k < steps; k++) {
      const t = k / steps, h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
      out.push([h00 * p[0] + h10 * m0[0] + h01 * q[0] + h11 * m1[0], h00 * p[1] + h10 * m0[1] + h01 * q[1] + h11 * m1[1]]);
    }
  }
  out.push(close ? out[0].slice() : pts[n - 1].slice()); return out;
}
function polyPath(pts, close = true) { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); if (close) p.closePath(); return p; }
// twoBone: place an elbow/knee for a limb of lengths a and b reaching from `root`
// towards `target` (law of cosines). Out-of-reach targets are clamped, not stretched.
// bend picks which side the joint folds to.
function twoBone(root, target, a, b, bend = 1) {
  const dx = target[0] - root[0], dy = target[1] - root[1], want = Math.hypot(dx, dy), d = clamp(want, Math.abs(a - b) + 1e-6, a + b);
  const dir = Math.atan2(dy, dx), open = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1)), ang = dir + (bend < 0 ? -open : open);
  return {root: root.slice(), joint: [root[0] + Math.cos(ang) * a, root[1] + Math.sin(ang) * a], end: [root[0] + Math.cos(dir) * d, root[1] + Math.sin(dir) * d], reachable: want <= a + b && want >= Math.abs(a - b)};
}

// ---------- canvases ----------
const resetT = c => c.setTransform(S, 0, 0, S, 0, 0);
function cam(c, x, y, zoom = 1, turn = 0) { resetT(c); c.translate(W / 2, H / 2); c.scale(zoom, zoom); c.rotate(turn); c.translate(-x, -y); }
function layer() { const L = document.createElement('canvas'); L.width = OUT_W; L.height = OUT_H; return L; }
const blit = (c, L) => { c.save(); resetT(c); c.drawImage(L, 0, 0, W, H); c.restore(); };
// sprite: a drawing painted once and reused (res > 1 for things the camera enlarges).
const _sprites = new Map();
function sprite(id, [x0, y0, w, h], draw, res = 1) {
  const k = `${id}|${S}|${res}`;
  if (_sprites.has(k)) { const v = _sprites.get(k); _sprites.delete(k); _sprites.set(k, v); return v; }
  const R = S * res, cv = document.createElement('canvas'); cv.width = Math.ceil(w * R); cv.height = Math.ceil(h * R);
  const g = cv.getContext('2d'); g.setTransform(R, 0, 0, R, -x0 * R, -y0 * R); draw(g);
  const v = {cv, x0, y0, w, h}; _sprites.set(k, v); if (_sprites.size > 48) _sprites.delete(_sprites.keys().next().value); return v;
}
const blitS = (c, sp, al = 1) => { c.save(); c.globalAlpha *= al; c.drawImage(sp.cv, sp.x0, sp.y0, sp.w, sp.h); c.restore(); };
function txt(c, s, x, y, {size = 40, font = 'Georgia, serif', color = '#000', align = 'center', weight = '', italic = false, al = 1, reveal = 1, shadow = null} = {}) {
  if (reveal <= 0 || al <= 0) return;
  const chars = [...s], shown = reveal >= 1 ? s : chars.slice(0, Math.ceil(reveal * chars.length)).join('');
  c.save(); resetT(c); c.globalAlpha *= al; c.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`; c.textAlign = align; c.fillStyle = color;
  if (shadow) { c.shadowColor = shadow; c.shadowBlur = 10; }
  c.fillText(shown, x, y); c.restore();
}

// ---------- score building blocks (Web Audio, rendered offline) ----------
// tone: one enveloped oscillator; hiss: a seeded noise burst that dies away.
function tone(ac, dest, f, t0, t, d, type = 'triangle', g = .2) {
  const o = ac.createOscillator(), e = ac.createGain(), at = t0 + t; o.type = type; o.frequency.value = f;
  e.gain.setValueAtTime(0, at); e.gain.linearRampToValueAtTime(g, at + .015); e.gain.exponentialRampToValueAtTime(.0006, at + d);
  o.connect(e).connect(dest); o.start(at); o.stop(at + d + .05);
}
function hiss(ac, dest, t0, t, d, g = .3, seed = 1) {
  const n = Math.ceil(ac.sampleRate * d), buf = ac.createBuffer(1, n, ac.sampleRate), data = buf.getChannelData(0), r = rng(seed);
  for (let i = 0; i < n; i++) { const fade = 1 - i / n; data[i] = (r() * 2 - 1) * fade * fade; }
  const src = ac.createBufferSource(), e = ac.createGain(); src.buffer = buf; e.gain.value = g; src.connect(e).connect(dest); src.start(t0 + t);
}

// ---------- the film ----------
let FILM = null, ctx = null, cv = null;
function defineFilm({timeline, score = null, fps = 24, width} = {}) {
  if (!timeline?.length || timeline.some(s => !(s.dur > 0) || typeof s.fn !== 'function')) throw new Error('timeline needs {name, dur > 0, fn}');
  const qs = new URLSearchParams(location.search), ow = +qs.get('w') || width || 1920;
  S = ow / W; OUT_W = Math.round(W * S); OUT_H = Math.round(H * S) & ~1;
  cv = document.getElementById('c') || document.body.appendChild(Object.assign(document.createElement('canvas'), {id: 'c'}));
  cv.width = OUT_W; cv.height = OUT_H; ctx = cv.getContext('2d');
  const DUR = timeline.reduce((a, s) => a + s.dur, 0), N = Math.round(DUR * fps);
  FILM = {timeline, score, fps, DUR, N};
  const locate = i => { let acc = 0, t = i / fps; for (let k = 0; k < timeline.length; k++) { const s = timeline[k]; if (t < acc + s.dur - 1e-9 || k === timeline.length - 1) return {s, tau: t - acc}; acc += s.dur; } };
  const draw = i => { const {s, tau} = locate(clamp(i | 0, 0, N - 1)); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); resetT(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.shadowBlur = 0; ctx.save(); try { s.fn(ctx, tau); } finally { ctx.restore(); } return s.name; };
  let last = -1, png = null;
  window.DT.frame = i => { if (i !== last) { draw(i); last = i; png = cv.toDataURL('image/png'); } return png; };
  const sheet = (list, cellW = 240) => { const cols = 6, rows = Math.ceil(list.length / cols), ch = Math.round(cellW * OUT_H / OUT_W), sh = document.createElement('canvas'); sh.width = cols * cellW; sh.height = rows * (ch + 18); const g = sh.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, sh.width, sh.height); g.font = '12px monospace'; g.fillStyle = '#eee';
    list.forEach((i, k) => { draw(i); last = -1; const x = (k % cols) * cellW, y = Math.floor(k / cols) * (ch + 18); g.drawImage(cv, x, y, cellW, ch); g.fillText(`${String(i).padStart(4, '0')}  ${(i / fps).toFixed(2)}s  ${locate(i).s.name}`, x + 4, y + ch + 13); });
    return sh.toDataURL('image/jpeg', .9); };
  window.DT.grid = (n = 24) => sheet(Array.from({length: n}, (_, k) => Math.round(k * (N - 1) / Math.max(1, n - 1))));
  window.DT.strip = (a, n = 12) => sheet(Array.from({length: n}, (_, k) => clamp(a + k, 0, N - 1)));
  window.DT.frames = N; window.DT.fps = fps; window.DT.size = {w: OUT_W, h: OUT_H}; window.DT.dur = DUR;
  window.DT.wav = score ? async () => { const sr = 48000, oac = new OfflineAudioContext(2, Math.ceil(sr * DUR), sr); score(oac, 0, oac.destination); const buf = await oac.startRendering(); const n = buf.length, out = new DataView(new ArrayBuffer(44 + n * 4)), ws = (o, s) => [...s].forEach((ch, i) => out.setUint8(o + i, ch.charCodeAt(0)));
    ws(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); ws(8, 'WAVE'); ws(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, sr, true); out.setUint32(28, sr * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true); ws(36, 'data'); out.setUint32(40, n * 4, true);
    const L = buf.getChannelData(0), R = buf.getChannelData(1); let o = 44; for (let i = 0; i < n; i++) { out.setInt16(o, clamp(L[i], -1, 1) * 32767, true); out.setInt16(o + 2, clamp(R[i], -1, 1) * 32767, true); o += 4; }
    const u = new Uint8Array(out.buffer); let b = ''; for (let k = 0; k < u.length; k += 32768) b += String.fromCharCode.apply(null, u.subarray(k, k + 32768)); return btoa(b); } : null;
  if (qs.has('bare')) { document.body.style.cssText = 'margin:0;background:#000'; cv.style.cssText = `width:${OUT_W}px;height:${OUT_H}px;display:block`; }
  else player(N, fps);
  document.fonts.ready.then(() => { if (qs.has('grid')) { const img = new Image(); img.src = window.DT.grid(+qs.get('grid') || 24); cv.hidden = true; cv.after(img); } else draw(+qs.get('frame') || 0); window.DT.ready = true; }).catch(e => { window.DT.error = String(e); });
  function player(N, fps) {
    const bar = document.createElement('div'); bar.innerHTML = '<button id="play">play</button> <input id="scrub" type="range" min="0" max="' + (N - 1) + '" value="0" style="width:60vw"> <span id="info"></span>'; bar.style.cssText = 'font:14px monospace;color:#ddd;padding:8px'; cv.after(bar);
    const info = bar.querySelector('#info'), scrub = bar.querySelector('#scrub'), play = bar.querySelector('#play'); let playing = false, t0 = 0;
    const show = i => { const name = draw(i); scrub.value = i; info.textContent = `${i}/${N}  ${(i / fps).toFixed(2)}s  ${name}`; };
    const loop = () => { if (!playing) return; show(Math.min(N - 1, Math.floor(((performance.now() - t0) / 1000 % (N / fps)) * fps))); requestAnimationFrame(loop); };
    play.onclick = () => { playing = !playing; play.textContent = playing ? 'pause' : 'play'; if (playing) { t0 = performance.now(); loop(); } };
    scrub.oninput = () => { playing = false; play.textContent = 'play'; show(+scrub.value); };
    show(0);
  }
}
