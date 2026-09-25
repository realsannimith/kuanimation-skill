'use strict';
// Sunflower film props: seed, roots, shoot, the growing plant (stem, leaves, seed
// leaves, bud, flower head, florets, seeds), bee, bird, the gardener's hat, watering
// can and umbrella. Everything is drawn with sh/mk, so the pencil style restyles it.
// (handText, arrowT, pathArrow and sparkle live in the skill's props.js.)

const SOIL_Y = 760;
const COL = {stem: '#8fbf68', leaf: '#86b865', leafOld: '#c2a95e', seed: '#57524b', stripe: '#ebe5d6', kernel: '#f1e6c2', root: '#ecdcb6', disc: '#7a5634', petal: '#f6c630', petalOld: '#c89a52', bract: '#6f9f52', pollen: '#f3c43a'};

const at = (q, u) => { const f = clamp(u, 0, 1) * (q.length - 1), i = Math.min(q.length - 2, Math.floor(f)); return lerp2(q[i], q[i + 1], f - i); };

// ---------- seed ----------
const SEED_PTS = [[0, 30, 1], [-9, 18], [-14, 0], [-13, -16], [-7, -27], [0, -30], [7, -27], [13, -16], [14, 0], [9, 18]];
// A striped sunflower seed, pointed end down. split 0..1 opens the shell at the top;
// face: null | 'sleep' | 'awake' | 'happy' draws a tiny light face on it.
function seedT(c, x, y, s = 1, ang = 0, {split = 0, face: fc = null, kernel = true} = {}) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  if (split > 0) {
    if (kernel) sh(c, ell(0, 6, 9 + 3 * split, 21, 18), COL.kernel, {w: 3.4});
    for (const sg of [-1, 1]) {
      c.save(); c.translate(0, 30); c.rotate(sg * .32 * easeOut(split)); c.translate(0, -30);
      sh(c, [[0, 30, 1], [sg * 9, 18], [sg * 14, 0], [sg * 13, -16], [sg * 7, -27], [0, -30, 1], [sg * 3, 0]], COL.seed, {w: 3.6});
      mk(c, [[sg * 7, -20], [sg * 9, 0], [sg * 6, 18]], {w: 3, color: COL.stripe});
      c.restore();
    }
  } else {
    sh(c, SEED_PTS, COL.seed, {w: 3.8});
    for (const dx of [-7, 0, 7]) mk(c, [[dx * .8, -24], [dx * 1.1, 0], [dx * .7, 22]], {w: 3, color: COL.stripe});
  }
  if (fc && split < .3) {
    const lc = '#fbf8ef';
    if (fc === 'sleep') for (const sg of [-1, 1]) mk(c, [[sg * 6 - 3, -2], [sg * 6, 1], [sg * 6 + 3, -2]], {w: 2.6, color: lc});
    else { c.fillStyle = lc; for (const sg of [-1, 1]) { c.beginPath(); c.arc(sg * 6, -2, 2.4, 0, TAU); c.fill(); } }
    mk(c, fc === 'awake' ? [[-3, 9], [0, 11], [3, 9]] : [[-4, 8], [0, 11], [4, 8]], {w: 2.4, color: lc});
  }
  c.restore();
}

// ---------- roots and shoot ----------
// rootT: a taproot growing down (g 0..1) with side roots and fine root hairs.
function rootT(c, x, y, g, {len = 120, seed = 3, spread = 1} = {}) {
  if (g <= 0) return;
  const pts = []; for (let k = 0; k <= 10; k++) pts.push([x + 12 * wobble(k * .7, seed) * (k / 10), y + len * k / 10]);
  const full = smoothLine(pts, 3);
  for (const [f, sg, l] of [[.2, -1, 62], [.32, 1, 70], [.46, -1, 56], [.58, 1, 50], [.72, -1, 40], [.82, 1, 30]]) {
    const gg = clamp((g - f) / .28, 0, 1) * spread; if (gg <= 0) continue;
    const p0 = at(full, f), side = smoothLine([p0, add(p0, [sg * l * .45, l * .16]), add(p0, [sg * l * .9, l * .55])], 3);
    const r = cutAt(side, gg); if (r.length > 1) mk(c, r, {w: 3.2, raw: true, color: '#a58d64'});
    if (gg > .6) for (let k = 1; k < 4; k++) { const hp = at(side, k / 4); mk(c, [hp, add(hp, [sg * 3, 9])], {w: 1.8, al: .6, color: '#a58d64'}); }
  }
  const q = cutAt(full, g); if (q.length > 1) sh(c, strip(q, profile([[0, 10], [1, 2.5]]), false), COL.root, {w: 3.4});
}
// shootT: the young stem pushing up from the seed, bent into a hook (hook 0..1) that
// carries the opened seed at its tip. Returns the tip position.
function shootT(c, base, tipY, hook, {seedS = 1.25} = {}) {
  const tip = [base[0] + 26 * hook, tipY], arch = [base[0] + 8 * hook, tipY - 20 * hook];
  if (base[1] - tipY > 4) {
    const q = smoothLine([base, [base[0] - 2, lerp(base[1], arch[1], .5)], arch, tip], 3);
    sh(c, strip(q, profile([[0, 11], [1, 9]]), false), '#cfe0a0', {w: 3.4});
  }
  seedT(c, tip[0], tip[1], seedS, Math.PI * .72 * hook, {split: 1});
  return tip;
}

// ---------- the plant ----------
const LEAF = [[0, 0, 1], [.18, -.27], [.5, -.35], [.82, -.2], [1.05, .04, 1], [.8, .2], [.48, .3], [.16, .2]];
const COT = [[0, 0, 1], [.3, -.22], [.75, -.24], [1.02, 0], [.75, .2], [.3, .16]];
function stemPts(x, gy, h, lean) { const B = [x, gy], M = [x + lean * .1, gy - h * .5], P = [x + lean, gy - h], out = []; for (let k = 0; k <= 12; k++) { const u = k / 12, a = (1 - u) ** 2, b = 2 * (1 - u) * u, d = u * u; out.push([B[0] * a + M[0] * b + P[0] * d, B[1] * a + M[1] * b + P[1] * d]); } return out; }
function leafT(c, p, side, L, ang, col) {
  const a = side > 0 ? ang : -ang, tipOf = v => add(p, rot([v[0] * side, v[1]], a));
  const p1 = tipOf([L * .32, 0]);
  mk(c, [p, lerp2(p, p1, .5), p1], {w: 4.4, color: shade(col, .15)});
  sh(c, xf(LEAF, p1[0], p1[1], L, a, side), col, {w: 4.2});
  mk(c, [p1, add(p1, rot([L * .45 * side, L * .02], a)), add(p1, rot([L * .95 * side, L * .04], a))], {w: 2.6, al: .8});
}
// plantT: a sunflower of stem height h standing at (x, gy). Options:
//   leaves (float: how many leaves, the newest still growing), cot (seed leaves 0..1),
//   head (bud size 0..1), bloom (petals open 0..1), yaw (-1 faces left/east .. 1 right/west),
//   droop (head bows 0..1), wilt (petals dry 0..1), fallen (fraction of petals gone),
//   florets (0..1 revealed from the rim in), seedy (florets turned to seeds 0..1),
//   R (disc radius), age (leaves yellow 0..1), t (time, for a gentle sway).
function plantT(c, x, gy, o = {}) {
  const {h = 200, lean = 0, t = 0, leaves = 0, cot = 0, cotAge = 0, head = 0, bloom = 0, yaw = 0, droop = 0, wilt = 0, fallen = 0, florets = 1, seedy = 0, R = 48, age = 0, pollen = 0, petalGrow = null, stemCol = COL.stem} = o;
  const sway = Math.sin(t * 1.25 + x * .013) * h * .012, q = stemPts(x, gy, h, lean + sway), wb = clamp(h * .036, 5, 20);
  // Leaves on the far side first, then the stem, then the near leaves.
  const nL = Math.ceil(leaves - 1e-6), L0 = clamp(h * .19, 18, 92), leafCol = mix(COL.leaf, COL.leafOld, age);
  const leafAt = k => { const g = clamp(leaves - k, 0, 1), u = clamp((k + 1 + (hash(k, 8) - .5) * .5) / (leaves + 1.3) * .9, .08, .9); return {g, u, side: k % 2 ? 1 : -1, L: L0 * (1 - .32 * u) * (.82 + .36 * hash(k, 6)) * easeOut(g), ang: -.62 + .5 * g + age * .55 + (hash(k, 9) - .5) * .5}; };
  for (let k = 0; k < nL; k++) { const f = leafAt(k); if (f.g > 0 && k % 4 === 1) leafT(c, at(q, f.u), f.side, f.L, f.ang, shade(leafCol, .06)); }
  sh(c, strip(q, profile([[0, wb], [1, wb * .55]]), false), mix(stemCol, COL.leafOld, age * .6), {w: 4.4});
  for (let k = 0; k < nL; k++) { const f = leafAt(k); if (f.g > 0 && k % 4 !== 1) leafT(c, at(q, f.u), f.side, f.L, f.ang, leafCol); }
  if (cot > 0) {
    const uc = clamp(48 / h, 0, 1), p = at(q, uc), L = 40 * easeOut(clamp(cot, 0, 1)), col = mix('#a3cf72', COL.leafOld, cotAge);
    for (const sg of [-1, 1]) sh(c, xf(COT, p[0], p[1], L, sg * (-.42 + .25 * cotAge), sg), col, {w: 3.8});
  }
  if (head > 0) {
    const top = q[q.length - 1], d = norm(sub(top, q[q.length - 3])), base = Math.atan2(d[1], d[0]) + Math.PI / 2;
    c.save(); c.translate(top[0], top[1]); c.rotate(base + droop * 1.25 * (yaw <= 0 ? -1 : 1) + yaw * .35);
    headT(c, yaw * R * .3 * head, -R * .3 * head, Math.max(.34, Math.cos(yaw * 1.15)), {R: R * (.55 + .45 * head), bloom, wilt, fallen, florets, seedy, pollen, petalGrow, yaw});
    c.restore();
  }
  return q[q.length - 1];
}
// The flower head in its own space (the stem enters from below).
function headT(c, x, y, sx, {R = 48, bloom = 0, wilt = 0, fallen = 0, florets = 1, seedy = 0, pollen = 0, petalGrow = null, yaw = 0} = {}) {
  c.save(); c.translate(x, y); c.scale(sx, 1);
  const bo = easeOut(clamp(bloom, 0, 1)), n = 13;
  // Green bracts: a star that spreads as the bud opens.
  const star = []; for (let k = 0; k < n * 2; k++) { const a = k / (n * 2) * TAU - Math.PI / 2, r = k % 2 ? R * (.72 + .18 * bo) : R * (1.22 + .08 * bo); star.push([Math.cos(a) * r, Math.sin(a) * r, k % 2 ? 0 : 1]); }
  sh(c, star, mix(COL.bract, COL.leafOld, wilt * .7), {w: 4});
  // Ray petals: a back ring and a front ring, each petal growing on its own beat.
  if (bloom > 0) for (const ring of [0, 1]) for (let k = 0; k < 21; k++) {
    const id = ring * 21 + k; if (hash(id, 7) < fallen) continue;
    const g = petalGrow ? petalGrow(id) : bo; if (g <= 0) continue;
    const a = (k + ring * .5) / 21 * TAU + .1, dir = [Math.cos(a), Math.sin(a)], nrm = [-dir[1], dir[0]], pl = R * (ring ? .95 : 1.05) * easeOutBack(g, 1.2) * (1 - wilt * .3), pw = R * .17 * (1 - wilt * .45);
    const b = mul(dir, R * .9), tip = add(add(b, mul(dir, pl)), [0, wilt * pl * .7]), mid = add(b, mul(sub(tip, b), .45));
    const col = mix(ring ? COL.petal : shade(COL.petal, .08), COL.petalOld, wilt);
    sh(c, [add(b, mul(nrm, -pw * .5)).concat(1), add(mid, mul(nrm, -pw)), tip.concat(1), add(mid, mul(nrm, pw)), add(b, mul(nrm, pw * .5)).concat(1)], col, {w: 3.4, tex: ring === 1});
  }
  // The disc: a green bud ball fades into the brown face as it opens.
  const disc = sh(c, circ(0, 0, R * .96, 30), mix(COL.disc, '#6b5a3e', seedy * .5), {w: 4.4});
  if (bloom < .45) { c.save(); c.globalAlpha *= 1 - bloom / .45; sh(c, circ(0, 0, R * .98, 30), '#86b35e', {w: 4.4});
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + .2; sh(c, [[Math.cos(a - .3) * R * .5, Math.sin(a - .3) * R * .5, 1], [Math.cos(a) * R * 1.02, Math.sin(a) * R * 1.02, 1], [Math.cos(a + .3) * R * .5, Math.sin(a + .3) * R * .5, 1]], '#9cc46e', {w: 2.8, tex: false}); } for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * .55; mk(c, [[Math.cos(a) * R * .2, Math.sin(a) * R * .2], [Math.cos(a) * R * .9, Math.sin(a) * R * .9]], {w: 2.6, al: .7}); } c.restore(); }
  // Florets in the sunflower's golden-angle spiral, appearing from the rim inward;
  // they turn into striped seeds as the head ripens.
  if (bloom > .3 && florets > 0) {
    const Nf = 170, fa = clamp((bloom - .3) / .4, 0, 1);
    c.save(); c.clip(disc); c.lineWidth = 1.1;
    for (let i = Nf - 1; i >= 0; i--) {
      const f = (i + .5) / Nf; if (f < 1 - florets) continue;
      const rr_ = R * .9 * Math.sqrt(f), th = i * 2.39996, px = Math.cos(th) * rr_, py = Math.sin(th) * rr_;
      c.save(); c.translate(px, py); c.rotate(th); c.globalAlpha *= fa;
      if (seedy > hash(i, 5)) { c.fillStyle = COL.seed; c.beginPath(); c.ellipse(0, 0, R * .07, R * .036, 0, 0, TAU); c.fill(); c.strokeStyle = COL.stripe; c.globalAlpha *= .9; c.beginPath(); c.moveTo(-R * .05, 0); c.lineTo(R * .05, 0); c.stroke(); }
      else { c.fillStyle = f > .55 ? mix('#e9a93c', '#9a6a2e', wilt) : '#5b3c22'; c.beginPath(); c.arc(0, 0, R * .045, 0, TAU); c.fill(); c.strokeStyle = 'rgba(58,56,53,.55)'; c.stroke(); }
      c.restore();
    }
    c.restore();
  }
  if (pollen > 0) { c.save(); c.globalAlpha *= pollen; c.fillStyle = COL.pollen; for (let k = 0; k < 16; k++) { c.beginPath(); c.arc((hash(k, 2) - .5) * R * 1.3, (hash(k, 3) - .5) * R * 1.3, 2.6, 0, TAU); c.fill(); } c.restore(); }
  c.restore();
}
// Head centre in world space for a plant (same maths as plantT), to aim bees and birds.
function headPos(x, gy, h, lean = 0, R = 48, yaw = 0) { return [x + lean + yaw * R * .3, gy - h - R * .3]; }
// A loose petal: dropped from the head, drifting down with a sway.
function petalT(c, x, y, ang, L, col) { c.save(); c.translate(x, y); c.rotate(ang); sh(c, [[0, 0, 1], [L * .45, -L * .17], [L, 0, 1], [L * .45, L * .17]], col, {w: 3.2, tex: false}); c.restore(); }

// ---------- visitors ----------
function beeT(c, x, y, s, t, {dir = 1, pollen = 0, flap = true} = {}) {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  const f = flap ? Math.floor(t * 24) % 2 : 0;
  for (const [dx, a] of [[-6, -.55], [6, -.15]]) { c.save(); c.translate(dx, -16); c.rotate(a + (f ? -.7 : 0)); sh(c, ell(0, -15, 10, 17, 16), '#e6f0f7', {w: 3, tex: false, al: .85}); c.restore(); }
  const body = sh(c, ell(0, 0, 27, 19, 24), T.yellow, {w: 4});
  c.save(); c.clip(body); c.globalAlpha *= .9; c.fillStyle = hatchPattern(c, '#3a3835', {dens: 1.8}); c.fillRect(-10, -22, 9, 44); c.fillRect(6, -22, 8, 44); c.restore();
  sh(c, [[-26, -4, 1], [-38, 0, 1], [-26, 5, 1]], '#3a3835', {w: 2.6});
  sh(c, circ(25, -3, 12, 16), '#4a4642', {w: 3.6});
  c.fillStyle = '#fbf8ef'; c.beginPath(); c.arc(29, -6, 3.2, 0, TAU); c.fill();
  mk(c, [[24, 3], [28, 5], [32, 3]], {w: 2.2, color: '#fbf8ef'});
  for (const sg of [0, 1]) mk(c, [[26 + sg * 3, -13], [30 + sg * 8, -26], [34 + sg * 10, -30]], {w: 2.4});
  for (let k = 0; k < 3; k++) mk(c, [[-8 + k * 9, 17], [-10 + k * 9, 26]], {w: 2.2});
  if (pollen > 0) { c.save(); c.globalAlpha *= pollen; for (let k = 0; k < 6; k++) sh(c, circ(-12 + k * 6, 16 + (k % 2) * 5, 4, 10), COL.pollen, {w: 1.6, tex: false}); c.restore(); }
  c.restore();
}
// A round little finch; peck 0..1 dips the head, flap 0|1 raises the wing.
function birdT(c, x, y, s, {dir = 1, flap = 0, peck = 0} = {}) {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  sh(c, [[-30, -6, 1], [-62, -24, 1], [-58, -4, 1], [-30, 6, 1]], '#8c7358', {w: 3.6});
  sh(c, ell(0, 0, 36, 25, 24), '#a88c6d', {w: 4});
  sh(c, ell(8, 9, 22, 13, 18), '#f0e2c6', {w: 3, tex: false});
  c.save(); c.translate(30 + peck * 8, -20 + peck * 16); c.rotate(peck * .6);
  sh(c, circ(0, 0, 16, 18), '#a88c6d', {w: 4});
  sh(c, [[13, -4, 1], [28, 2, 1], [13, 6, 1]], T.orange, {w: 3});
  c.fillStyle = '#2f2d2a'; c.beginPath(); c.arc(5, -4, 3, 0, TAU); c.fill();
  c.restore();
  c.save(); c.translate(-4, -6); c.rotate(flap ? -1.1 : .15); sh(c, [[0, 0, 1], [-30, -6], [-40, 8, 1], [-10, 14]], '#8c7358', {w: 3.4}); c.restore();
  for (const dx of [-4, 8]) mk(c, [[dx, 22], [dx, 34], [dx + 6, 36]], {w: 2.6, color: T.orange});
  c.restore();
}
// The gardener's straw sun hat, and a watering can the gardener tilts to pour.
HATS.sunhat = (c, r) => {
  sh(c, [[-r * .95, -r * .1, 1], [-r * .9, -r * .55], [-r * .4, -r * .9], [r * .4, -r * .9], [r * .9, -r * .55], [r * .95, -r * .1, 1], [r * .5, -r * .45], [-r * .5, -r * .45]], '#6d4e37', {w: 3.6});
  sh(c, ell(0, -r * .62, r * 1.6, r * .3, 24), '#ecd392', {w: 4});
  sh(c, [[-r * .72, -r * .66, 1], [-r * .62, -r * 1.2], [0, -r * 1.35], [r * .62, -r * 1.2], [r * .72, -r * .66, 1]], '#ecd392', {w: 4});
  mk(c, [[-r * .7, -r * .78], [0, -r * .74], [r * .7, -r * .78]], {w: 7, color: T.red});
};
function canProp(tilt) {
  return {draw: (c, h) => {
    if (!h) return; c.save(); c.translate(h[0], h[1]); c.rotate(tilt);
    mk(c, [[-18, 10], [-14, -8], [8, -8], [14, 10]], {w: 5});
    sh(c, [[24, 26, 1], [66, -10, 1], [70, -3, 1], [30, 38, 1]], T.teal, {w: 3.6});
    sh(c, rr(-32, 8, 60, 42, 8), T.teal, {w: 4.4});
    sh(c, ell(70, -8, 6, 11, 12), shade(T.teal, .2), {w: 3});
    c.restore();
  }};
}
const spoutAt = (px, py, s, tilt) => { const k = s * PPK, h = [36, -84], sp = rot([70, -8], tilt); return [px + (h[0] + sp[0]) * k, py + (h[1] + sp[1]) * k]; };
// Falling water drops from a point, and drops seeping down through the soil.
function waterDrops(c, tau, t0, t1, from, to, {n = 10, seed = 2} = {}) {
  if (tau < t0 || tau > t1 + .6) return;
  for (let k = 0; k < n * 4; k++) {
    const born = t0 + (k / (n * 4)) * (t1 - t0), u = (tau - born) / .5; if (u < 0 || u > 1) continue;
    const x = lerp(from[0], to[0] + (hash(k, seed) - .5) * 50, u), y = lerp(from[1], to[1], u * u);
    sh(c, [[x, y - 9, 1], [x + 5, y], [x, y + 5], [x - 5, y]], T.water, {w: 2.2, tex: false});
  }
}
function seep(c, tau, t0, t1, x, y0, y1, {n = 8, seed = 4} = {}) {
  const u0 = span(t0, t1, tau, linear); if (u0 <= 0 || u0 >= 1) return;
  for (let k = 0; k < n; k++) { const u = clamp(u0 * 1.4 - hash(k, seed) * .4, 0, 1); if (u <= 0 || u >= 1) continue; const px = x + (hash(k, seed + 1) - .5) * 70 * (1 - u), py = lerp(y0, y1, u);
    c.save(); c.globalAlpha *= Math.sin(u * Math.PI); sh(c, circ(px, py, 5, 10), T.water, {w: 2, tex: false}); c.restore(); }
}
// Seeds packed in the head's spiral, for a zoomed-in callout.
function seedPatch(c, w, h) {
  const p = polyPath(circ(0, 0, Math.min(w, h) * .42, 30)); c.save(); c.clip(p);
  c.fillStyle = '#6b5a3e'; c.fillRect(-w / 2, -h / 2, w, h);
  for (let i = 60; i >= 0; i--) { const f = (i + .5) / 60, r = Math.min(w, h) * .42 * Math.sqrt(f), th = i * 2.39996; seedT(c, Math.cos(th) * r, Math.sin(th) * r, .42, th + Math.PI / 2); }
  c.restore(); mk(c, circ(0, 0, Math.min(w, h) * .42, 30), {w: 4, close: true});
}

// An umbrella held over the head (pp prop, drawn in the figure's local space).
const UMBRELLA = {draw: (c, h) => {
  if (!h) return; const top = [h[0] - 6, h[1] - 150];
  mk(c, [[h[0], h[1] + 16], [h[0] - 2, h[1] - 10], top], {w: 5});
  mk(c, [[h[0], h[1] + 16], [h[0] + 4, h[1] + 26], [h[0] + 12, h[1] + 22]], {w: 5});
  const R = 92, pts = [[top[0] - R, top[1] + 30, 1]];
  for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI; pts.push([top[0] + Math.cos(a) * R, top[1] + 30 + Math.sin(a) * R * .72]); }
  pts[pts.length - 1][2] = 1; for (let k = 3; k >= 1; k--) { const x0 = top[0] - R + k * R / 2; pts.push([x0 + R / 4, top[1] + 22, 0], [x0, top[1] + 30, 1]); }
  sh(c, pts, T.red, {w: 4.4});
  for (let k = 1; k < 4; k++) mk(c, [[top[0], top[1] - R * .72 + 30], [top[0] - R + k * R / 2, top[1] + 30]], {w: 2.6, al: .7});
  mk(c, [[top[0], top[1] - R * .72 + 30], [top[0], top[1] - R * .72 + 14]], {w: 4});
}};
// A grey rain cloud drawn at full line weight (not scaled).
function rainCloud(c, x, y, s) { sh(c, xf([[-70, 20, 1], [-76, 0], [-60, -18], [-36, -22], [-24, -44], [6, -50], [30, -34], [52, -38], [72, -16], [76, 10], [66, 20, 1]], x, y, s), '#b7bcc6', {w: LINE}); }
