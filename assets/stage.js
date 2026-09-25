'use strict';
// The stage in four looks. 'wash' (default): an open watercolour landscape, full frame:
// by day a sky, soft clouds, cream horizon, rolling hills and a sandy road; at night an
// indigo sky, faintly outlined clouds, a dark bush band and a blue-grey ground; outlined
// players on outline-free scenery; plain hand-lettered subtitles; soft fades.
// 'haze': a painted animation background, misty layered forests of scalloped canopy
// clumps fading into a bright glow, dusty earth with scratchy brush marks and grass, a
// vignette; thin warm-brown ink throughout.
// 'paper' ("Paper Diorama"): a kraft-card shadow
// box, layered torn-paper landscapes, a paper ground, a torn sheet that sweeps down
// between scenes, and subtitles on a taped paper strip with a highlighter swipe.
// 'marker': red curtains, tiled floor, watercolour blooms, a slate subtitle bar.

const PALETTES = {};
PALETTES.marker = {
  ol: '#1b1512',
  curtain: '#c63a2d', curtainDk: '#9e2a22', gold: '#e3a93b', goldDk: '#b87d22',
  floor: '#b9824f', floorDk: '#8f5e35', skin: '#e8b98e', skinDk: '#c98f62', white: '#f6f1e6',
  red: '#d9533f', orange: '#e0874f', pink: '#e79aa6', blue: '#3f7fa6', navy: '#2c3d63', teal: '#3a9a93',
  green: '#6aa35a', greenDk: '#3f7045', yellow: '#f1c24e', brown: '#8c5a34', grey: '#9a9794', greyDk: '#6d6a67',
  stone: '#d6bf8e', stoneDk: '#a98d5c', saffron: '#ee9b36', purple: '#8a6bb0', sky: '#a9d3e0', water: '#6fb3c8', waterDk: '#3d86a0',
};
// Sun-washed paper: terracotta, marigold, teal, indigo, blush, sage, kraft.
PALETTES.paper = {
  ol: '#3a2a22',
  curtain: '#c9573f', curtainDk: '#a2412e', gold: '#e9a93a', goldDk: '#b97f25',
  floor: '#c49a6c', floorDk: '#9c7448', skin: '#eab48c', skinDk: '#c98e63', white: '#f7f0e2',
  red: '#d9674a', orange: '#ec8f4e', pink: '#f0a3a0', blue: '#4f86b0', navy: '#34427a', teal: '#2f8f8a',
  green: '#7fae6e', greenDk: '#4f7d52', yellow: '#f2b233', brown: '#8f6443', grey: '#a8a39c', greyDk: '#7b766f',
  stone: '#dcc59a', stoneDk: '#b3976a', saffron: '#f09a3a', purple: '#8b6fae', sky: '#b9dbe0', water: '#5fa9b8', waterDk: '#3b7f93',
};
// Sunny watercolour: sky blue, meadow greens, teal hills, sandy road, warm accents.
PALETTES.wash = {
  ol: '#1d1a1c',
  curtain: '#d8633f', curtainDk: '#b04d31', gold: '#f2b940', goldDk: '#c98f22',
  floor: '#e6d8bb', floorDk: '#c9b894', skin: '#f0bb8e', skinDk: '#d0936a', white: '#f8f4ea',
  red: '#e0664a', orange: '#e8843e', pink: '#eca0aa', blue: '#5b9bd0', navy: '#3f4f86', teal: '#35a0a0',
  green: '#78b35c', greenDk: '#4f8a4a', yellow: '#f5c142', brown: '#8a5a3a', grey: '#a7a6a8', greyDk: '#79777b',
  stone: '#e0c898', stoneDk: '#b89b6a', saffron: '#f19a38', purple: '#5f5094', sky: '#9fcbe6', water: '#63b0cc', waterDk: '#3b88a8',
};
// Per mood: [sky top, sky low, horizon band, far hills, near hills, road].
const WASH_MOODS = {
  warm: ['#9ccbe8', '#bfdcee', '#efe6cf', '#9cc4a8', '#86b872', '#e6d7b8'], dawn: ['#f2b7a8', '#f8d7b0', '#f6e6cc', '#b8b9a2', '#9ab67a', '#e9d6b6'],
  sea: ['#8fc6e6', '#c2e2ee', '#eee7d2', '#88bfc0', '#7fb49a', '#eadcbc'], green: ['#9fd0e4', '#cbe6e8', '#eee8cf', '#8fc39a', '#6fae5c', '#e2d6b2'],
  night: ['#1c2750', '#26336a', '#3a4a78', '#2b3a66', '#2a3968', '#4a5a86'], fire: ['#3a2140', '#7a3244', '#9a4a4a', '#4a2c44', '#44304a', '#6a4a5a'],
  gold: ['#f1c77a', '#f7dea6', '#f6ead0', '#c9b27a', '#a7b867', '#ead7ae'], milk: ['#cfe6ec', '#eef3ea', '#f7f2e6', '#bcd8cf', '#a8cfb4', '#efe6d4'],
  saffron: ['#f3c07e', '#f8dcae', '#f6e9d0', '#c6b884', '#9fb46e', '#ead6ae'], dust: ['#e7c795', '#f1ddb8', '#f3e5c8', '#c8a878', '#b39a64', '#dcc49a'],
  storm: ['#2a3558', '#3a4670', '#4d5a80', '#34466a', '#33456c', '#56648c'], forest: ['#a9d4df', '#d0e6df', '#ece8cf', '#6fa67a', '#4f8f52', '#d9ccaa'],
};
// Hazy painted animation: sage, olive, dusty terracotta, stone grey, muted accents.
PALETTES.haze = {
  ol: '#3a3024',
  curtain: '#b0604a', curtainDk: '#8a4a3a', gold: '#cfa954', goldDk: '#a07e36',
  floor: '#b9906a', floorDk: '#94704e', skin: '#dcab84', skinDk: '#b98762', white: '#efeade',
  red: '#b35a48', orange: '#cc8550', pink: '#cf9d98', blue: '#6a8eaa', navy: '#48506a', teal: '#5f928c',
  green: '#86a077', greenDk: '#587258', yellow: '#dcbf68', brown: '#7c5b42', grey: '#a09d92', greyDk: '#6f6c64',
  stone: '#b3a88f', stoneDk: '#7f7766', saffron: '#d29448', purple: '#6c5f80', sky: '#c9d6cf', water: '#9fb7b6', waterDk: '#6f8f92',
};
// Per mood: [sky top, sky low (haze), forest, ground, glow].
const HAZE_MOODS = {
  warm: ['#aebca9', '#eef0e2', '#7f9a78', '#b98f6c', '#fff6dc'], dawn: ['#c9ad9e', '#f3e4d2', '#899a74', '#c09070', '#ffe0bc'],
  sea: ['#a9bfbd', '#eef2ea', '#7a9a80', '#c2a07c', '#ffffff'], green: ['#a8bea7', '#e9efe0', '#6f9270', '#aa8a64', '#f6f8e0'],
  forest: ['#94ab96', '#dfe6d6', '#5f8466', '#9c7f5c', '#eef4dc'], gold: ['#cdbd92', '#f4ecd4', '#8c9a6a', '#c49a68', '#fff0c8'],
  saffron: ['#d2b692', '#f5e8d2', '#8a9468', '#c4966a', '#ffe6c0'], milk: ['#bccfca', '#f2f4ec', '#86a490', '#c6aa88', '#ffffff'],
  dust: ['#c9b594', '#eee2cc', '#9a9468', '#b88c62', '#fbe8c8'], night: ['#16222e', '#2e4254', '#2c433e', '#3c464c', '#9fb8d0'],
  storm: ['#36424c', '#66737c', '#3d544e', '#56574f', '#c8d0d6'], fire: ['#301c28', '#84402f', '#3c3830', '#573a30', '#ffae6a'],
};
const T = {...PALETTES.wash};
// ---------- watercolour backdrops ----------
const MOODS = {
  warm: ['#f6e7c8', '#f2b8a8', '#f5d27a', '#f0a07a'], dawn: ['#f7e6cf', '#f4b3b8', '#f8d38a', '#e9a0b8'],
  sea: ['#eef0dc', '#9fd0d4', '#f5d98c', '#bfe0d0'], green: ['#eef0d6', '#b6d79a', '#f3dc8a', '#9fcf9f'],
  night: ['#2b3150', '#3d4a78', '#5b3a6a', '#27304e'], fire: ['#3a2438', '#b94a3a', '#e98a45', '#5b2a40'],
  gold: ['#f8ecc6', '#f6cf6e', '#f2b25a', '#f7e09a'], milk: ['#f3f1e6', '#b9e0dc', '#f2c9d6', '#e6efc9'],
  saffron: ['#f7ebd0', '#f3c078', '#f0a55a', '#f6dca0'], dust: ['#f1e2c2', '#dcae72', '#e7c48a', '#c99060'],
  storm: ['#cfd6db', '#8ea3b3', '#a9b8c2', '#6f8596'], forest: ['#e6eccf', '#8fbf7f', '#c9de9a', '#6fa26a'],
};
function washLayer(mood, seed = 1) {
  if (STYLE === 'haze') return hazeLandscape(mood, seed);
  if (STYLE === 'wash') return washLandscape(mood, seed);
  if (STYLE === 'paper') return paperLandscape(mood, seed);
  return sprite('wash-' + mood + seed, [0, 0, W, H], g => {
    const [base, ...cols] = MOODS[mood], r = rng(seed * 7 + 3);
    g.fillStyle = base; g.fillRect(0, 0, W, H);
    // A few large blooms: pale centres, pigment gathered at the drying edge, soft runs downward.
    for (let i = 0; i < 13; i++) {
      const col = cols[i % cols.length], x = r() * W, y = r() * H * .8, R = 260 + r() * 360, pts = [];
      for (let k = 0; k < 22; k++) { const a = k / 22 * TAU, q = R * (.72 + r() * .35); pts.push([x + Math.cos(a) * q, y + Math.sin(a) * q * .75]); }
      const p = polyPath(smoothLine(pts, 8, true), true);
      g.save(); g.globalAlpha = .34 + r() * .2; const gr = g.createRadialGradient(x, y, R * .1, x, y, R); gr.addColorStop(0, alpha(col, .45)); gr.addColorStop(.8, alpha(col, .85)); gr.addColorStop(1, col); g.fillStyle = gr; g.filter = 'blur(6px)'; g.fill(p); g.restore();
      g.save(); g.globalAlpha = .22; g.strokeStyle = shade(col, .18); g.lineWidth = 2 + r() * 3; g.filter = 'blur(1.5px)'; g.stroke(p); g.restore();
    }
    g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .6; g.fillStyle = paperPattern(g); g.fillRect(0, 0, W, H); g.restore();
  });
}

// ---------- the stage ----------
const STG = {floorY: 760, x0: 150, x1: 1770, top: 44};
function stageFloor(c, mood) {
  if (STYLE === 'haze') return hazeGround(c, mood);
  if (STYLE === 'wash') return washGround(c, mood);
  if (STYLE === 'paper') return paperGround(c, mood);
  const fy = STG.floorY, vx = W / 2, vy = 120;
  sh(c, [[-400, fy, 1], [W + 400, fy, 1], [W + 400, H + 400, 1], [-400, H + 400, 1]], vgrad('#c89461', '#a5703f'), {w: 0});
  c.save(); c.strokeStyle = T.ol; c.lineWidth = 2.4; c.globalAlpha = .75; c.beginPath();
  for (let k = -18; k <= 18; k++) { const xb = vx + k * 135; c.moveTo(lerp(vx, xb, (fy - vy) / (H + 40 - vy)), fy); c.lineTo(lerp(vx, xb, (H + 400 - vy) / (H + 40 - vy)), H + 400); }
  for (const y of [fy + 36, fy + 84, fy + 146, fy + 226, fy + 330, fy + 470]) { c.moveTo(-400, y); c.lineTo(W + 400, y); }
  c.stroke(); c.restore();
  mk(c, [[-400, fy], [W + 400, fy]], {w: LINE});
}
// Side curtains frame the opening with a wavy inner edge and a gold tie-back.
function sideCurtains(c, open = 1) {
  const wv = (y, amp, ph) => amp * Math.sin(y / 70 + ph);
  for (const sg of [-1, 1]) {
    const inner = sg < 0 ? 175 : W - 175, pts = [];
    pts.push([sg < 0 ? -30 : W + 30, -20, 1]);
    for (let y = -20; y <= H + 20; y += 30) { const tie = Math.exp(-Math.pow((y - 470) / 110, 2)) * 60, x = inner - sg * (tie * 1.4) + wv(y, 14, sg) + sg * (y > 600 ? (y - 600) * .08 : 0); pts.push([x, y]); }
    pts.push([sg < 0 ? -30 : W + 30, H + 20, 1]);
    sh(c, pts, hgrad(sg < 0 ? T.curtainDk : T.curtain, sg < 0 ? T.curtain : T.curtainDk), {w: LINE});
    for (let k = 1; k < 4; k++) { const q = []; for (let y = 0; y <= H; y += 30) { const tie = Math.exp(-Math.pow((y - 470) / 110, 2)) * 40; q.push([(sg < 0 ? 0 : W) - sg * (k * 38 + tie * .6 * k / 3) + wv(y, 8, k + sg), y]); } mk(c, q, {w: 2.2, al: .9}); }
    sh(c, rr(inner - sg * 60 - 32, 452, 64, 30, 14), T.gold, {w: 4});
  }
}
function valance(c) {
  const pts = [[-30, -20, 1], [W + 30, -20, 1], [W + 30, 30, 1]];
  for (let x = W + 20, k = 0; x > -40; x -= 46, k++) pts.push([x, k % 2 ? 50 : 36, 1]);
  sh(c, pts, vgrad(T.curtain, T.curtainDk), {w: LINE});
  const trim = []; for (let x = -30, k = 0; x < W + 40; x += 23, k++) trim.push([x, 28 + (k % 2 ? 6 : 0)]);
  mk(c, trim, {w: 3, color: T.gold});
}
// The main curtains that close between chapters; open = 1 is fully open.
function mainCurtain(c, open) {
  if (open >= 1) return;
  const cover = (1 - easeInOutSine(open)) * (W / 2 + 40);
  for (const sg of [-1, 1]) {
    const x0 = sg < 0 ? -40 : W + 40, x1 = sg < 0 ? cover - 40 : W - cover + 40, pts = [[x0, -20, 1], [x1, -20, 1]];
    for (let y = 0; y <= H + 20; y += 30) pts.push([x1 + Math.sin(y / 60 + open * 6) * 10 * sg, y]);
    pts.push([x0, H + 20, 1]);
    sh(c, pts, hgrad(T.curtain, T.curtainDk), {w: LINE});
    for (let k = 1; k < 9; k++) { const x = lerp(x0, x1, k / 9), q = []; for (let y = 0; y <= H; y += 40) q.push([x + Math.sin(y / 80 + k) * 8, y]); mk(c, q, {w: 2.2, al: .8}); }
  }
}
// Stage in three calls so the cast can stand between backdrop and curtains.
let BACK_DARK = false;
function stageBack(c, mood, seed = 1) {
  const sky = STYLE === 'haze' ? HAZE_MOODS[mood] : STYLE === 'wash' ? WASH_MOODS[mood] : null;
  BACK_DARK = !!sky && parseColor(sky[0]).reduce((a, b) => a + b) < 300;
  resetT(c); blitS(c, washLayer(mood, seed));
}
function stageFront(c, open = 1) { resetT(c); if (STYLE === 'haze') hazeFront(c, open); else if (STYLE === 'wash') softFade(c, open); else if (STYLE === 'paper') { tearShutter(c, open); shadowBox(c); } else { sideCurtains(c); valance(c); mainCurtain(c, open); } }

// ---------- Hazy painted animation (haze) ----------
// A canopy clump: a scalloped cauliflower of leaves, lit from the upper right, shaded
// underneath, with a thin ink line on the lobes. Used for every tree and forest.
function clump(g, x, y, r, {base, lit, dk, ink = INK, inkAl = .55, lw = 1.8, seed = 1} = {}) {
  const R = rng(seed), n = 5 + (R() * 4 | 0), ph = R() * TAU, pts = [];
  for (let k = 0; k < 56; k++) { const a = k / 56 * TAU, s = Math.sin(a), lobe = Math.sqrt(Math.abs(Math.sin(a * n / 2 + ph))), rad = r * (.8 + .22 * lobe) * (1 + .06 * wobble(k / 7, seed)); pts.push([x + Math.cos(a) * rad * 1.12, y + s * rad * (s > 0 ? .5 : .78)]); }
  const p = polyPath(pts, true);
  g.save(); g.fillStyle = base; g.fill(p); g.clip(p);
  g.fillStyle = dk; g.globalAlpha = .75; g.beginPath(); g.ellipse(x - r * .25, y + r * .5, r * 1.25, r * .42, 0, 0, TAU); g.fill();
  g.fillStyle = lit; g.globalAlpha = .85; g.fill(polyPath(pts.map(([px, py]) => [x + r * .22 + (px - x) * .66, y - r * .3 + (py - y) * .6]), true));
  g.restore();
  g.save(); g.globalAlpha = inkAl; g.strokeStyle = ink; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(p);
  // one or two inner leaf-mass strokes
  g.lineWidth = lw * .8; g.beginPath(); const a0 = -2.4 + R() * .6; g.arc(x + r * .1, y - r * .05, r * .55, a0, a0 + .9); g.stroke(); g.restore();
  return p;
}
// A forest band: rows of clumps from back to front, trunks peeking below, all mixed
// toward the haze by distance k (0 near, 1 far) so far layers dissolve into mist.
function canopyBand(g, {y0, y1, r0, r1, base, haze, glow, k, seed, x0 = -80, x1 = W + 80, trunks = true, roll = 40}) {
  const R = rng(seed), col = mix(shade(base, (1 - k) * .14), haze, k), ink = mix(INK, haze, k * .8), inkAl = .7 * (1 - k * .55);
  const lit = mix(col, glow, .3), dk = shade(col, .26 - k * .12);
  const lift = x => roll * (.5 + .5 * Math.sin(x / 340 + seed * 2.1)) * (.6 + .4 * Math.sin(x / 130 + seed));
  g.fillStyle = dk; g.fillRect(x0, y0 + r1 * .3, x1 - x0, H - y0);
  for (let y = y0, row = 0; y <= y1; y += (r0 + r1) * .3, row++) {
    const t = (y - y0) / Math.max(1, y1 - y0);
    for (let x = x0 - R() * 60; x < x1; ) { const r = lerp(r0, r1, t) * (.6 + R() * .8), cx = x + r * .5, cy = y - lift(cx) * (1 - t * .7) + (R() - .5) * r * .5;
      if (trunks && R() < .55) { g.save(); g.strokeStyle = mix(shade(base, .45), haze, k * .7); g.lineWidth = Math.max(2, r * .08); g.lineCap = 'round'; for (let j = 0; j < 1 + (R() * 2 | 0); j++) { const tx = cx + (R() - .5) * r * .8; g.beginPath(); g.moveTo(tx, cy + r * .2); g.lineTo(tx + (R() - .5) * 6, cy + r * (1 + R() * .5)); g.stroke(); } g.restore(); }
      const v = (R() - .5) * .1; clump(g, cx, cy, r, {base: v > 0 ? tint(col, v) : shade(col, -v), lit, dk, ink, inkAl, lw: 1.3 + (1 - k) * 1.1, seed: seed * 97 + row * 31 + (x | 0)}); x += r * (1.1 + R() * .5); }
  }
}
// Backdrop: a hazy sky with a bright glow at the upper right, a misty far ridge, a
// middle forest and a near forest (or a pale sea with white glints), all in layers.
function hazeLandscape(mood, seed = 1) {
  return sprite('haze-' + mood + seed, [0, 0, W, H], g => {
    const [s0, s1, forest, , glow] = HAZE_MOODS[mood] || HAZE_MOODS.warm, r = rng(seed * 17 + 3), dark = parseColor(s0).reduce((a, b) => a + b) < 300;
    const sky = g.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, s0); sky.addColorStop(1, s1); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const gx = W * .8, gy = 120, gl = g.createRadialGradient(gx, gy, 0, gx, gy, 900); gl.addColorStop(0, alpha(glow, dark ? .35 : .9)); gl.addColorStop(1, alpha(glow, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    // Soft cumulus: overlapping round lobes on a flat base; the pencil line follows
    // only the outer silhouette.
    for (let i = 0; i < 4; i++) { const cx = 120 + i * 520 + r() * 200, cy = 170 + r() * 180, w = 320 + r() * 260, n = 4 + (r() * 3 | 0), lobes = [];
      for (let k = 0; k < n; k++) { const u = (k + .5) / n; lobes.push([cx - w / 2 + u * w, cy, w / n * (.75 + r() * .35) * (.7 + .5 * Math.sin(u * Math.PI))]); }
      const pts = []; for (let x = cx - w / 2 - 30; x <= cx + w / 2 + 30; x += 6) { let y = cy; for (const [mx, my, rad] of lobes) { const d = x - mx; if (Math.abs(d) < rad) y = Math.min(y, my - Math.sqrt(rad * rad - d * d) * .8); } pts.push([x, y]); }
      const top = pts.filter(q => q[1] < cy - .5); if (top.length < 2) continue; const shape = [...top, [top[top.length - 1][0], cy], [top[0][0], cy]];
      const p = polyPath(shape, true); g.save(); g.fillStyle = alpha(mix(s1, glow, .5), dark ? .16 : .6); g.filter = 'blur(4px)'; g.fill(p); g.restore();
      g.save(); g.strokeStyle = alpha(dark ? glow : INK, dark ? .18 : .16); g.lineWidth = 1.6; g.lineJoin = 'round'; g.beginPath(); top.forEach((q, k) => k ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke(); g.restore(); }
    // Far ridge, deep in the mist.
    const ridge = [[-60, H]]; for (let x = -60; x <= W + 60; x += 40) ridge.push([x, 430 - 120 * Math.pow(Math.max(0, Math.sin(x / 520 + seed)), 1.6) - 18 * wobble(x / 90, seed)]); ridge.push([W + 60, H]);
    g.fillStyle = mix(forest, s1, .72); g.fill(polyPath(ridge, true));
    canopyBand(g, {y0: 440, y1: 470, r0: 26, r1: 30, base: forest, haze: s1, glow, k: .66, seed: seed + 1, trunks: false});
    if (mood === 'sea') {
      const wy = 500, wa = g.createLinearGradient(0, wy, 0, 700); wa.addColorStop(0, mix(s1, '#ffffff', .4)); wa.addColorStop(1, mix(T.water, s1, .35)); g.fillStyle = wa; g.fillRect(0, wy, W, H - wy);
      g.save(); g.strokeStyle = alpha('#ffffff', .85); g.lineCap = 'round'; for (let i = 0; i < 70; i++) { const x = r() * W, y = wy + 20 + Math.pow(r(), .8) * 200, l = 14 + r() * 60 * (y - wy) / 200; g.lineWidth = 1.2 + (y - wy) / 120; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 3, x + l, y); g.stroke(); } g.restore();
      canopyBand(g, {y0: 640, y1: 700, r0: 44, r1: 58, base: forest, haze: s1, glow, k: .12, seed: seed + 3, x1: W * .38});
    } else {
      canopyBand(g, {y0: 500, y1: 560, r0: 30, r1: 44, base: forest, haze: s1, glow, k: .42, seed: seed + 2, roll: 60});
      canopyBand(g, {y0: 620, y1: 700, r0: 46, r1: 70, base: forest, haze: s1, glow, k: .08, seed: seed + 3, roll: 70});
      // Two tall near trees at the edges frame the stage and give depth.
      for (const [tx, sg] of [[70 + r() * 60, -1], [W - 70 - r() * 60, 1]]) {
        const col = shade(forest, .16), o = {base: col, lit: mix(col, glow, .28), dk: shade(col, .25), inkAl: .8, lw: 2.4};
        g.save(); g.fillStyle = shade(forest, .55); g.beginPath(); g.moveTo(tx - 14, STG.floorY + 10); g.lineTo(tx - 6, 300); g.lineTo(tx + 8, 300); g.lineTo(tx + 16, STG.floorY + 10); g.fill(); g.restore();
        for (let j = 0; j < 5; j++) clump(g, tx + sg * 20 + (r() - .5) * 200, 250 + j * 70 + (r() - .5) * 40, 90 + r() * 50, {...o, seed: seed * 7 + j + (sg > 0 ? 50 : 0)});
      }
    }
    // Mist rising between the layers, brightest under the glow.
    const mist = g.createLinearGradient(0, 380, 0, 620); mist.addColorStop(0, alpha(s1, 0)); mist.addColorStop(.5, alpha(s1, dark ? .12 : .3)); mist.addColorStop(1, alpha(s1, 0)); g.fillStyle = mist; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .22; g.fillStyle = mottlePattern(g); g.fillRect(0, 0, W, H); g.restore();
  });
}
// Ground: dusty earth under a fringe of grass, scratchy brush tracks, tufts and soft
// cast-shadow pools, with a thin ink line along the grass edge.
function hazeGround(c, mood = 'warm') {
  const [, s1, forest, ground] = HAZE_MOODS[mood] || HAZE_MOODS.warm, fy = STG.floorY;
  const sp = sprite('hazeground-' + mood, [-400, fy - 30, W + 800, H + 430 - fy], g => {
    const r = rng(41), top = [[-400, H + 400]]; for (let x = -400; x <= W + 400; x += 30) top.push([x, fy + 3 * wobble(x / 80, 2)]); top.push([W + 400, H + 400]);
    const gr = g.createLinearGradient(0, fy, 0, H); gr.addColorStop(0, mix(ground, forest, .2)); gr.addColorStop(.4, ground); gr.addColorStop(1, shade(ground, .14)); g.fillStyle = gr; g.fill(polyPath(top, true));
    // Soft shadow pools and lighter worn patches.
    for (let i = 0; i < 9; i++) { g.save(); g.globalAlpha = .13; g.fillStyle = i % 3 ? shade(forest, .3) : mix(ground, '#ffffff', .5); g.beginPath(); g.ellipse(-300 + r() * (W + 600), fy + 80 + r() * 230, 160 + r() * 260, 26 + r() * 40, 0, 0, TAU); g.fill(); g.restore(); }
    // Scratchy tracks: long thin arcs, like brush marks in dry earth.
    g.save(); g.strokeStyle = alpha(INK, .28); g.lineCap = 'round';
    for (let i = 0; i < 70; i++) { const x = -350 + r() * (W + 700), y = fy + 30 + r() * 300, l = 40 + r() * 140, b = (r() - .5) * 14; g.lineWidth = .9 + r() * 1.2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y + b, x + l, y + b * .3); g.stroke(); }
    g.restore();
    // Grass fringe with a wavy lower edge, then tufts.
    const grass = [[-400, fy - 2]]; for (let x = -400; x <= W + 400; x += 26) grass.push([x, fy + 3 * wobble(x / 80, 2)]); for (let x = W + 400; x >= -400; x -= 40) grass.push([x, fy + 20 + 16 * Math.abs(wobble(x / 110, 6))]);
    const gp = polyPath(grass, true); g.fillStyle = mix(forest, ground, .25); g.fill(gp); g.save(); g.clip(gp); g.fillStyle = alpha(mix(forest, '#ffffff', .25), .5); g.fillRect(-400, fy - 4, W + 800, 10); g.restore();
    g.save(); g.strokeStyle = alpha(INK, .4); g.lineWidth = 1.3; g.lineCap = 'round';
    for (let i = 0; i < 110; i++) { const x = -380 + r() * (W + 760), y = fy + 8 + Math.pow(r(), 1.8) * 300, h = 6 + r() * 12; g.beginPath(); g.moveTo(x - 4, y - h * .7); g.lineTo(x, y); g.lineTo(x + 2, y - h); g.moveTo(x, y); g.lineTo(x + 6, y - h * .6); g.stroke(); }
    g.strokeStyle = alpha(INK, .55); g.lineWidth = 1.8; g.beginPath(); for (let x = -400; x <= W + 400; x += 26) { const y = fy + 3 * wobble(x / 80, 2); x === -400 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); g.restore();
  }, 1);
  blitS(c, sp);
}
// Overlay in screen space: a vignette that darkens the corners, the glow bleeding in
// from the upper right, and scene changes that dissolve through the mist.
function hazeFront(c, open) {
  resetT(c); c.save();
  const v = c.createRadialGradient(W * .55, H * .45, H * .35, W * .5, H * .5, W * .75); v.addColorStop(0, 'rgba(34,46,38,0)'); v.addColorStop(1, `rgba(34,46,38,${BACK_DARK ? .55 : .42})`); c.fillStyle = v; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'screen'; const g = c.createRadialGradient(W * .85, 0, 0, W * .85, 0, W * .6); g.addColorStop(0, `rgba(255,248,226,${BACK_DARK ? .08 : .22})`); g.addColorStop(1, 'rgba(255,248,226,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.restore();
  if (open < 1) { c.save(); c.globalAlpha = 1 - easeInOutSine(clamp(open, 0, 1)); c.fillStyle = '#dfe2d4'; c.fillRect(0, 0, W, H); c.restore(); }
}

// ---------- Sunny watercolour (wash) ----------
// Watercolour pools: soft-edged pigment with a slightly darker drying rim.
function pool(g, pts, col, {al = .9, blur = 3, rim = .18} = {}) {
  const p = polyPath(smoothLine(pts, 6, true), true);
  g.save(); g.globalAlpha = al; g.fillStyle = col; g.filter = `blur(${blur}px)`; g.fill(p); g.restore();
  if (col !== '#ffffff' && col !== '#c8cde0') { g.save(); g.clip(p); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .45; g.fillStyle = mottlePattern(g); g.fillRect(0, 0, W, H); g.restore(); }
  if (rim) { g.save(); g.globalAlpha = rim; g.strokeStyle = shade(col, .2); g.lineWidth = 2; g.filter = 'blur(1px)'; g.stroke(p); g.restore(); }
  return p;
}
function washCloud(g, x, y, w, seed, col = '#ffffff') { const r = rng(seed), pts = []; for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, q = 1 + (r() - .5) * .35; pts.push([x + Math.cos(a) * w * .5 * q, y + Math.sin(a) * w * .22 * q - (Math.sin(a) < 0 ? w * .08 * r() : 0)]); } pool(g, pts, col, {al: .62, blur: 7, rim: .05}); pool(g, pts.map(([px, py]) => [x + (px - x) * .7, y - 6 + (py - y) * .6]), col, {al: .45, blur: 5, rim: 0}); }
// Backdrop: sky, watercolour clouds, a cream horizon band, far and near hills, little trees.
function washLandscape(mood, seed = 1) {
  return sprite('washland-' + mood + seed, [0, 0, W, H], g => {
    const [s0, s1, hz, far, near] = WASH_MOODS[mood] || WASH_MOODS.warm, r = rng(seed * 13 + 7), dark = parseColor(s0).reduce((a, b) => a + b) < 260;
    const sky = g.createLinearGradient(0, 0, 0, 560); sky.addColorStop(0, s0); sky.addColorStop(1, s1); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .35; g.fillStyle = mottlePattern(g); g.fillRect(0, 0, W, H); g.restore();
    if (dark) return washNight(g, [s0, s1, hz, far, near], r, seed);
    for (let i = 0; i < 3; i++) washCloud(g, 180 + i * 640 + r() * 200, 90 + r() * 160, 260 + r() * 160, seed * 5 + i, dark ? '#c8cde0' : '#ffffff');
    pool(g, [[-40, 470], [W + 40, 470], [W + 40, 600], [-40, 600]], hz, {al: 1, blur: 2, rim: 0});
    const hill = (y0, amp, col, k) => { const pts = [[-60, H]]; for (let x = -60; x <= W + 60; x += 80) pts.push([x, y0 - amp * (.5 + .5 * Math.sin(x / (380 - k * 90) + seed * 2 + k * 1.7))]); pts.push([W + 60, H]); pool(g, pts, col, {al: 1, blur: 1.5, rim: .1}); };
    hill(560, 60, far, 0); hill(640, 70, near, 1);
    for (let i = 0; i < 7; i++) { const x = 60 + r() * (W - 120), y = 620 + r() * 110; g.save(); g.strokeStyle = '#7a5236'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2, y - 40); g.stroke(); g.restore(); pool(g, smoothLine(ell(x + 2, y - 52, 24, 20, 10), 8, true).slice(0, -1), shade(near, .12), {al: .95, blur: 1.5, rim: .12}); }
    for (let i = 0; i < 26; i++) { g.fillStyle = [T.pink, T.yellow, '#ffffff', T.blue][i % 4]; g.globalAlpha = .9; g.beginPath(); g.arc(r() * W, 690 + r() * 60, 3.4, 0, TAU); g.fill(); g.globalAlpha = 1; }
  });
}
// Night: deep indigo, clouds only as faint light outlines, a band of lumpy dark
// bushes on the horizon, and a flat blue-grey ground plane (drawn by washGround).
function washNight(g, [s0, s1, hz, far, near], r, seed) {
  // Clouds as faint, wispy light outlines: a soft silhouette of uneven overlapping lobes
  // over a gently wavy base, drawn with a thin chalky line and a whisper of fill.
  for (let i = 0; i < 3; i++) { const cx = 260 + i * 620 + r() * 160, cy = 380 + r() * 180, w = 520 + r() * 300, n = 6 + (r() * 4 | 0), lobes = [];
    for (let k = 0; k < n; k++) { const u = (k + .5) / n; lobes.push([cx - w / 2 + u * w + (r() - .5) * w / n * .6, w / n * (.55 + r() * .7) * (.55 + .6 * Math.sin(u * Math.PI))]); }
    const top = []; for (let x = cx - w / 2 - 40; x <= cx + w / 2 + 40; x += 5) { let y = cy; for (const [mx, rad] of lobes) { const d = x - mx; if (Math.abs(d) < rad) y = Math.min(y, cy - Math.sqrt(rad * rad - d * d) * .55); } top.push([x, y + 2 * wobble(x / 23, seed + i)]); }
    const t = top.filter(q => q[1] < cy - 2); if (t.length < 2) continue;
    const base = []; for (let x = t[t.length - 1][0]; x >= t[0][0]; x -= 8) base.push([x, cy + 8 * wobble(x / 90, seed * 3 + i) + 4 * wobble(x / 31, i + 7)]);
    const pts = [...t, ...base], p = polyPath(pts, true);
    g.save(); g.fillStyle = alpha('#9aa9d8', .05); g.fill(p); g.filter = 'blur(.7px)'; g.lineJoin = 'round'; g.lineCap = 'round';
    g.strokeStyle = alpha('#aab8e4', .3); g.lineWidth = 2.6; g.stroke(p);
    g.strokeStyle = alpha('#aab8e4', .12); g.lineWidth = 1.4; g.translate(3, 2); g.stroke(p); g.restore(); }
  const bush = []; bush.push([-60, STG.floorY + 6]); for (let x = -60; x <= W + 60; x += 46) bush.push([x, STG.floorY - 18 - 44 * Math.abs(Math.sin(x / 120 + seed)) - r() * 22]); bush.push([W + 60, STG.floorY + 6]);
  pool(g, bush, mix(near, '#6b7fc0', .35), {al: 1, blur: 3, rim: .2});
}
// Ground: a sandy road band with a soft edge and a few dashes.
function washGround(c, mood = 'warm') {
  const road = (WASH_MOODS[mood] || WASH_MOODS.warm)[5], fy = STG.floorY;
  const sp = sprite('washground-' + mood, [-400, fy - 20, W + 800, H + 420 - fy], g => {
    pool(g, [[-400, fy + 4], [W + 400, fy - 2], [W + 400, H + 400], [-400, H + 400]], road, {al: 1, blur: 1.5, rim: .15});
    const r = rng(29); g.strokeStyle = alpha(shade(road, .35), .6); g.lineWidth = 3; g.lineCap = 'round';
    for (let i = 0; i < 18; i++) { const x = -300 + r() * (W + 600), y = fy + 40 + r() * 280, l = 18 + r() * 40; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + r() * 2); g.stroke(); }
    g.strokeStyle = alpha(shade(road, .25), .5); g.lineWidth = 2.4; g.beginPath(); g.moveTo(-400, fy); g.lineTo(W + 400, fy); g.stroke();
  }, 1);
  blitS(c, sp);
}
// Scene changes fade softly through warm cream paper.
function softFade(c, open) { if (open >= 1) return; resetT(c); c.save(); c.globalAlpha = 1 - easeInOutSine(clamp(open, 0, 1)); c.fillStyle = '#f4ecdb'; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'multiply'; c.globalAlpha *= .5; c.fillStyle = mottlePattern(c); c.fillRect(0, 0, W, H); c.restore(); }


// ---------- Paper Diorama ----------
// A backdrop cut from layered paper: a sky sheet with a soft glow, then three bands
// of rolling hills, each a shade deeper and nearer, every edge torn and shadowed.
function paperLandscape(mood, seed = 1) {
  return sprite('paper-' + mood + seed, [0, 0, W, H], g => {
    const [base, a, b, cc] = MOODS[mood], r = rng(seed * 11 + 5), night = parseColor(base).reduce((x, y) => x + y) < 300;
    const sky = g.createLinearGradient(0, 0, 0, STG.floorY); sky.addColorStop(0, mix(a, base, .35)); sky.addColorStop(1, base); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .45; g.fillStyle = paperPattern(g); g.fillRect(0, 0, W, H); g.restore();
    // Cloud strips torn from white paper (the scene adds its own sun or moon).
    for (let i = 0; i < 4; i++) { const cx = 150 + i * 480 + r() * 160, cy = 110 + r() * 170, w = 190 + r() * 150; sh(g, [[cx - w / 2, cy, 1], [cx - w * .3, cy - 22], [cx - w * .05, cy - 36], [cx + w * .2, cy - 26], [cx + w / 2, cy, 1]], alpha(night ? '#c9cde0' : '#fffaf0', .92), {lift: .5}); }
    // Three hill bands.
    [[520, 90, mix(cc, base, .45)], [600, 70, mix(b, cc, .5)], [680, 55, mix(a, cc, .6)]].forEach(([y0, amp, col], k) => {
      const pts = [[-40, H, 1], [-40, y0, 0]]; for (let x = -40; x <= W + 40; x += 60) pts.push([x, y0 - amp * (.55 + .45 * Math.sin(x / (260 - k * 40) + seed * 3 + k * 2)) + r() * 12]);
      pts.push([W + 40, y0, 0], [W + 40, H, 1]);
      sh(g, pts, vgrad(tint(col, .1), shade(col, .08)), {lift: .9});
    });
  });
}
// Paper ground: a kraft sheet with a torn top edge and a darker strip in front.
function paperGround(c, mood = 'warm') {
  const fy = STG.floorY, tone = mix(MOODS[mood] ? MOODS[mood][3] : T.floor, T.floor, .55), toneDk = shade(mix(MOODS[mood] ? MOODS[mood][1] : T.floorDk, T.floorDk, .5), .12);
  const top = [[-400, H + 400, 1], [-400, fy + 4]]; for (let x = -400; x <= W + 400; x += 80) top.push([x, fy + Math.sin(x / 170) * 5]); top.push([W + 400, fy + 4], [W + 400, H + 400, 1]);
  sh(c, top, vgrad(tone, shade(tone, .1)), {lift: .8});
  const front = [[-400, H + 400, 1], [-400, fy + 190]]; for (let x = -400; x <= W + 400; x += 80) front.push([x, fy + 180 + Math.sin(x / 130 + 1) * 8]); front.push([W + 400, fy + 190], [W + 400, H + 400, 1]);
  sh(c, front, vgrad(toneDk, shade(toneDk, .12)), {lift: 1});
  // A dotted stitch along the join, like a sewn seam.
  c.save(); c.fillStyle = alpha('#fff6e0', .65); for (let x = -380; x < W + 400; x += 26) { c.beginPath(); c.ellipse(x, fy + 200 + Math.sin(x / 130 + 1) * 8, 7, 2, 0, 0, TAU); c.fill(); } c.restore();
}
// The shadow box: a kraft-card frame with rounded inner corners, an inner shadow,
// and washi tape across two corners.
function shadowBox(c) {
  const m = 34, r = 38;
  c.save();
  const outer = new Path2D(); outer.rect(-10, -10, W + 20, H + 20);
  const inner = polyPath(curve(rr(m, m, W - 2 * m, H - 2 * m, r), true), true);
  const frame = new Path2D(); frame.addPath(outer); frame.addPath(inner);
  c.shadowColor = 'rgba(40,24,12,.55)'; c.shadowBlur = 26 * S; c.shadowOffsetX = 0; c.shadowOffsetY = 6 * S;
  c.fillStyle = '#8f6541'; c.fill(frame, 'evenodd'); c.shadowColor = 'transparent';
  c.save(); c.clip(frame, 'evenodd'); c.globalCompositeOperation = 'multiply'; c.globalAlpha = .7; c.fillStyle = paperPattern(c); c.fillRect(0, 0, W, H); c.restore();
  // corrugated edge showing at the cut
  c.strokeStyle = alpha('#fff1d6', .5); c.lineWidth = 3; c.stroke(inner);
  c.restore();
  for (const [x, y, a] of [[70, 44, -.6], [W - 70, H - 44, -.6]]) { c.save(); c.translate(x, y); c.rotate(a); c.globalAlpha = .82; c.fillStyle = '#9fd1c8'; c.fillRect(-80, -20, 160, 40); c.globalAlpha = .35; c.fillStyle = '#ffffff'; for (let k = -70; k < 80; k += 20) c.fillRect(k, -20, 8, 40); c.restore(); }
}
// Between scenes a torn kraft sheet sweeps down and lifts away (open 0 = covered).
function tearShutter(c, open) {
  if (open >= 1) return;
  const y = (1 - easeInOutSine(open)) * (H + 80) - 40, pts = [[-40, -60, 1], [W + 40, -60, 1]];
  for (let x = W + 40; x >= -40; x -= 24) pts.push([x, y + 16 * wobble(x / 40, 3) + 8 * wobble(x / 11, 7)]);
  const saved = STYLE; sh(c, pts, vgrad('#d9b48a', '#c19566'), {lift: 1.4});
  // Pale torn fibres along the ripped edge.
  const edge = []; for (let x = -40; x <= W + 40; x += 12) edge.push([x, y + 16 * wobble(x / 40, 3) + 8 * wobble(x / 11, 7) - 2]);
  c.save(); c.strokeStyle = alpha('#fff4de', .8); c.lineWidth = 5; c.beginPath(); edge.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
}


// ---------- subtitles: line 1 in the film's language, an optional line 2 under it, the spoken part marked ----------
// Line 1 uses the style's lettering, falling back glyph by glyph to the script fonts for
// scripts it lacks, so the same call works for any language; a Khmer line keeps the Khmer
// font throughout (spaces included) so its spacing stays true.
function lineFont(base) { const scripts = FONT.khmer.replace(/,\s*serif\s*$/, ''), m = base.match(/^(.*?),\s*(sans-serif|serif|cursive)\s*$/); return m ? `${m[1]}, ${scripts}, ${m[2]}` : `${base}, ${scripts}`; }
function subtitle(c, l1, l2, u, a = 1, {font1 = null, font2 = null} = {}) {
  if (a <= 0) return;
  font2 = font2 || (STYLE === 'marker' ? FONT.serif : FONT.ui);
  font1 = font1 || (/[\u1780-\u17ff\u19e0-\u19ff]/.test(l1) ? FONT.khmer : lineFont(font2));
  if (STYLE === 'wash' || STYLE === 'haze') return washSubtitle(c, l1, l2, u, a, font1, font2);
  resetT(c); c.save(); c.globalAlpha = a;
  const f1 = `34px ${font1}`, f2 = STYLE === 'paper' ? `600 29px ${font2}` : `italic 600 29px ${font2}`;
  c.font = f1; const w1 = c.measureText(l1).width; c.font = f2; const w2 = l2 ? c.measureText(l2).width : 0;
  const bw = Math.min(W - 200, Math.max(w1, w2) + 110), bh = l2 ? 116 : 76, x0 = W / 2 - bw / 2, y0 = H - 40 - bh - 22;
  if (STYLE === 'paper') {
    // A torn cream paper strip held by two pieces of washi tape.
    const pts = [[x0, y0 + 6, 1]]; for (let x = x0; x <= x0 + bw; x += 22) pts.push([x, y0 + 4 * wobble(x / 19, 2)]); pts.push([x0 + bw, y0 + 4, 1], [x0 + bw + 4, y0 + bh, 1]); for (let x = x0 + bw; x >= x0; x -= 22) pts.push([x, y0 + bh + 4 * wobble(x / 17, 4)]);
    sh(c, pts, '#fbf4e4', {lift: 1.1});
    for (const [x, rotn] of [[x0 + 12, -.35], [x0 + bw - 12, .35]]) { c.save(); c.translate(x, y0 + 6); c.rotate(rotn); c.globalAlpha = a * .85; c.fillStyle = '#f2b8b0'; c.fillRect(-42, -14, 84, 28); c.globalAlpha = a * .35; c.fillStyle = '#fff'; for (let k = -36; k < 40; k += 14) c.fillRect(k, -14, 6, 28); c.restore(); }
  } else sh(c, [[x0 + 26, y0, 1], [x0 + bw - 26, y0, 1], [x0 + bw, y0 + bh / 2, 1], [x0 + bw - 26, y0 + bh, 1], [x0 + 26, y0 + bh, 1], [x0, y0 + bh / 2, 1]], '#3b3f4f', {w: 4, tex: false});
  const line = (s, font, y, size, base, lit, p) => {
    c.font = font; const w = c.measureText(s).width, x = W / 2 - w / 2;
    if (STYLE === 'paper' && p > 0) { c.save(); c.globalAlpha = a * .75; c.fillStyle = lit; const hw = w * p; c.beginPath(); c.moveTo(x - 6, y - size * .72); c.lineTo(x + hw + 4, y - size * .78); c.lineTo(x + hw + 8, y + size * .22); c.lineTo(x - 4, y + size * .28); c.closePath(); c.fill(); c.restore(); }
    c.fillStyle = base; c.textAlign = 'left'; c.fillText(s, x, y);
    if (STYLE !== 'paper' && p > 0) { c.save(); c.beginPath(); c.rect(x, y - size, w * p, size * 1.6); c.clip(); c.fillStyle = lit; c.fillText(s, x, y); c.restore(); }
  };
  if (STYLE === 'paper') { line(l1, f1, y0 + 50, 34, '#3a2a22', '#ffd964', u); if (l2) line(l2, f2, y0 + 94, 29, '#5b4636', '#ffe38a', u); }
  else { line(l1, f1, y0 + 50, 34, '#f4efe2', T.gold, u); if (l2) line(l2, f2, y0 + 94, 29, '#cfd3dc', '#f6d27a', u); }
  c.restore();
}

// Wash subtitles: plain lettering on the road, a soft light halo for legibility,
// the unspoken part lighter, the spoken part darker and underlined.
function washSubtitle(c, l1, l2, u, a, font1, font2) {
  resetT(c); c.save(); c.globalAlpha = a; c.textAlign = 'left';
  const row = (s, font, y, size, p) => {
    c.font = font; const w = c.measureText(s).width, x = W / 2 - w / 2;
    const dim = BACK_DARK ? '#9aa3c4' : '#8c8790', lit = BACK_DARK ? '#fbf6ea' : '#2c2a33', halo = BACK_DARK ? 'rgba(10,14,34,.95)' : 'rgba(255,250,240,.95)';
    c.save(); c.shadowColor = halo; c.shadowBlur = 14; c.fillStyle = dim; c.fillText(s, x, y); c.restore();
    if (p > 0) { c.save(); c.beginPath(); c.rect(x - 2, y - size * 1.1, w * p + 2, size * 1.6); c.clip(); c.shadowColor = halo; c.shadowBlur = 10; c.fillStyle = lit; c.fillText(s, x, y); c.restore();
      c.save(); c.strokeStyle = alpha(lit, .75); c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y + size * .28); c.lineTo(x + w * p, y + size * .28); c.stroke(); c.restore(); }
  };
  const y2 = H - 58, y1 = l2 ? y2 - 50 : y2;
  row(l1, `34px ${font1}`, y1, 34, u);
  if (l2) row(l2, `600 32px ${font2}`, y2, 32, u);
  c.restore();
}
