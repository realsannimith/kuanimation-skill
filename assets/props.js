'use strict';
// Stage props: wave rollers, hanging signs, scenery on sticks, trees, houses,
// buildings, boats, fire, confetti, a hanging map. All are drawn with sh/mk, so they
// follow the style. budTower, angkorFlat, bayonT, brickTowerT, buddhaT, gateT and flagT
// (Cambodia) are Khmer props from the Angkor example.

// A painted wave flat that rocks side to side, as on a theatre stage.
function waveRoller(c, y, t, {col = T.water, dk = T.waterDk, amp = 30, ph = 0, h = 90, x0 = 150, x1 = 1770} = {}) {
  const off = Math.sin(t * 1.3 + ph) * amp, pts = [[x0 - 60, y + h, 1]];
  for (let x = x0 - 60; x <= x1 + 60; x += 20) pts.push([x, y + Math.sin((x - off) / 46) * 10 - (Math.floor((x - off + 1e4) / 92) % 2 ? 0 : 0)]);
  pts.push([x1 + 60, y + h, 1]);
  sh(c, pts, vgrad(col, dk), {w: LINE});
  for (let x = x0 - 40; x < x1 + 40; x += 92) { const xx = x + off % 92; mk(c, [[xx, y + 26], [xx + 16, y + 20], [xx + 30, y + 26]], {w: 3, color: '#f4fbfa', al: .9}); }
}
// A hanging sign board on two ropes.
function signBoard(c, x, y, w, h, text, {font = FONT.serif, size = 44, fill = '#9b6a3e', col = '#f6ecd6', drop = 1} = {}) {
  const yy = lerp(-h - 60, y, easeOutBack(clamp(drop, 0, 1)));
  if (drop <= 0) return;
  for (const sg of [-1, 1]) mk(c, [[x + sg * w * .32, -10], [x + sg * w * .32, yy]], {w: 3.4});
  sh(c, rr(x - w / 2, yy, w, h, 14), fill, {w: LINE});
  c.save(); resetT(c); c.restore();
  c.save(); c.font = `${font === FONT.khmer ? '' : '600 '}${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(text, x, yy + h / 2 + 2); c.restore();
}
// A prop on a stick, raised by a stagehand below the floor line.
function onStick(c, x, y, draw, p = 1) {
  if (p <= 0) return; const yy = y + (1 - easeOutBack(clamp(p, 0, 1))) * 400;
  mk(c, [[x, yy], [x, yy + 400]], {w: 9}); mk(c, [[x, yy], [x, yy + 400]], {w: 4, color: '#b48554'});
  c.save(); c.translate(x, yy); draw(c); c.restore();
}
function sunBurst(c, x, y, r, t, {col = T.yellow, rays = true} = {}) {
  if (STYLE === 'pencil') {   // a hatched yellow disc, short sketchy rays that turn slowly
    if (rays) for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + t * .12, j = .9 + .2 * hash(k, 4); mk(c, [[x + Math.cos(a) * r * 1.22, y + Math.sin(a) * r * 1.22], [x + Math.cos(a) * r * (1.45 + .25 * j), y + Math.sin(a) * r * (1.45 + .25 * j)]], {w: 4, color: T.goldDk}); }
    sh(c, circ(x, y, r, 30), col, {w: LINE}); return;
  }
  if (STYLE === 'wash' || STYLE === 'haze') {   // a flat disc, a soft glow and a paler highlight: no rays, no outline
    glowLight(c, x, y, r * 2.4, '#fff3c4', .55);
    c.save(); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.restore(); mottle(c, polyPath(circ(x, y, r, 40)), .25);
    c.save(); c.globalAlpha = .5; c.fillStyle = '#fff4c8'; c.beginPath(); c.ellipse(x - r * .12, y - r * .38, r * .45, r * .26, -.2, 0, TAU); c.fill(); c.restore();
    return;
  }
  if (rays) { c.save(); c.translate(x, y); c.rotate(t * .15); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; sh(c, [[Math.cos(a - .1) * r * 1.15, Math.sin(a - .1) * r * 1.15, 1], [Math.cos(a) * r * 1.8, Math.sin(a) * r * 1.8, 1], [Math.cos(a + .1) * r * 1.15, Math.sin(a + .1) * r * 1.15, 1]], T.gold, {w: 3.6}); } c.restore(); }
  sh(c, circ(x, y, r, 30), col, {w: LINE});
}
function cloudT(c, x, y, s, {col = T.white} = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (STYLE === 'haze') { c.save(); c.filter = 'blur(2px)'; sh(c, [[-70, 20, 1], [-76, 0], [-60, -18], [-36, -22], [-24, -44], [6, -50], [30, -34], [52, -38], [72, -16], [76, 10], [66, 20, 1]], alpha(col, .8), {tex: false, line: false}); c.restore(); sh(c, [[-70, 20, 1], [-76, 0], [-60, -18], [-36, -22], [-24, -44], [6, -50], [30, -34], [52, -38], [72, -16], [76, 10], [66, 20, 1]], null, {w: 3, al: .35}); c.restore(); return; }
  sh(c, [[-70, 20, 1], [-76, 0], [-60, -18], [-36, -22], [-24, -44], [6, -50], [30, -34], [52, -38], [72, -16], [76, 10], [66, 20, 1]], col, {w: LINE});
  c.restore();
}
function palmT(c, x, y, h, {lean = 0} = {}) {
  const top = [x + lean, y - h];
  sh(c, strip([[x, y], [x + lean * .4, y - h * .5], top], profile([[0, 22], [1, 14]])), T.brown, {w: LINE});
  for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .45; sh(c, [[top[0], top[1], 1], [top[0] + Math.cos(a - .18) * 70, top[1] + Math.sin(a - .18) * 60], [top[0] + Math.cos(a) * 90, top[1] + Math.sin(a) * 76, 1], [top[0] + Math.cos(a + .18) * 70, top[1] + Math.sin(a + .18) * 60]], k % 2 ? T.green : T.greenDk, {w: 4}); }
}
function treeT(c, x, y, h, {col = T.green} = {}) {
  if (STYLE === 'haze') {   // a trunk under three canopy clumps
    sh(c, strip([[x, y], [x - 4, y - h * .45], [x + 2, y - h * .7]], profile([[0, 24], [1, 12]])), T.brown, {w: LINE});
    const o = {base: col, lit: mix(col, '#f4f0d8', .32), dk: shade(col, .2), inkAl: .85, lw: 2.2};
    clump(c, x - h * .18, y - h * .66, h * .26, {...o, seed: 3}); clump(c, x + h * .2, y - h * .7, h * .24, {...o, seed: 5}); clump(c, x, y - h * .88, h * .3, {...o, seed: 7});
    return;
  }
  sh(c, rr(x - 14, y - h * .5, 28, h * .5, 6), T.brown, {w: LINE});
  sh(c, [[x - h * .38, y - h * .44], [x - h * .44, y - h * .7], [x - h * .2, y - h * .96], [x + h * .14, y - h], [x + h * .42, y - h * .78], [x + h * .4, y - h * .5], [x + h * .1, y - h * .4]], col, {w: LINE});
}
function stiltHouse(c, x, y, s, {col = T.orange, roof = T.red} = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const px of [-36, 0, 36]) sh(c, rr(px - 5, -40, 10, 40, 3), T.brown, {w: 3.6});
  sh(c, rr(-48, -96, 96, 58, 6), col, {w: LINE}); sh(c, rr(-12, -80, 24, 42, 4), T.brown, {w: 3.6});
  sh(c, [[-66, -94, 1], [0, -150, 1], [66, -94, 1]], roof, {w: LINE});
  c.restore();
}
// Angkor Wat as a painted flat: five lotus-bud towers over stepped galleries.
function budTower(c, x, by, w, h, col = T.stone) {
  sh(c, [[x - w / 2, by, 1], [x - w / 2, by - h * .35, 1], [x - w * .42, by - h * .62], [x - w * .24, by - h * .88], [x, by - h, 1], [x + w * .24, by - h * .88], [x + w * .42, by - h * .62], [x + w / 2, by - h * .35, 1], [x + w / 2, by, 1]], col, {w: LINE});
  for (let k = 1; k < 5; k++) { const yy = by - h * (.35 + k * .12), ww = w * .5 * (1 - k * .15); mk(c, [[x - ww, yy], [x + ww, yy]], {w: 3}); }
  sh(c, rr(x - w * .14, by - h * .26, w * .28, h * .26, w * .1), '#4a3a2c', {w: 3.4});
  sh(c, circ(x, by - h - 6, 7, 12), T.gold, {w: 3.4});
}
function angkorFlat(c, x, y, s, {col = T.stone, dk = T.stoneDk} = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const [dx, w, h] of [[-250, 90, 250], [250, 90, 250], [-130, 100, 290], [130, 100, 290]]) budTower(c, dx, -250, w, h, col);
  budTower(c, 0, -250, 130, 370, col);
  sh(c, rr(-320, -270, 640, 70, 8), col, {w: LINE}); for (let k = 0; k < 11; k++) sh(c, rr(-290 + k * 54, -254, 22, 36, 6), '#4a3a2c', {w: 3});
  sh(c, rr(-420, -200, 840, 90, 8), dk, {w: LINE}); for (let k = 0; k < 15; k++) sh(c, rr(-395 + k * 54, -184, 24, 50, 6), '#4a3a2c', {w: 3});
  sh(c, rr(-520, -110, 1040, 110, 8), col, {w: LINE}); for (let k = 0; k < 19; k++) sh(c, rr(-500 + k * 54, -90, 26, 60, 6), '#4a3a2c', {w: 3});
  sh(c, [[-60, 0, 1], [-40, -270, 1], [40, -270, 1], [60, 0, 1]], dk, {w: LINE}); for (let k = 1; k < 12; k++) mk(c, [[-60 + k * 1.8, -k * 22], [60 - k * 1.8, -k * 22]], {w: 2.6});
  c.restore();
}
// The Bayon: a tower with the calm smiling face.
function bayonT(c, x, y, s, {col = T.stone, mood = 'happy'} = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  sh(c, [[-110, 0, 1], [-110, -250, 1], [-70, -300], [-40, -380], [0, -420, 1], [40, -380], [70, -300], [110, -250, 1], [110, 0, 1]], col, {w: LINE});
  for (let k = 1; k < 4; k++) mk(c, [[-80 + k * 8, -250 - k * 36], [80 - k * 8, -250 - k * 36]], {w: 3});
  sh(c, rr(-90, -250, 180, 22, 6), T.gold, {w: 4});
  c.save(); c.translate(0, -140);
  for (const sg of [-1, 1]) sh(c, rr(sg * 84 - 12, -70, 24, 100, 10), col, {w: 4});
  for (const sg of [-1, 1]) { mk(c, [[sg * 18, -44], [sg * 40, -52], [sg * 62, -44]], {w: 5}); mk(c, [[sg * 20, -20], [sg * 40, -28], [sg * 60, -20]], {w: 5}); }
  mk(c, [[-6, -30], [-10, 10], [8, 12]], {w: 4.4});
  sh(c, [[-40, 34, 1], [40, 34, 1], [30, 52], [0, 58], [-30, 52]], '#8a5a44', {w: 4.4});
  mk(c, [[-44, 32], [0, 40], [44, 32]], {w: 4.6});
  c.restore();
  for (let k = 0; k < 3; k++) mk(c, [[-110, -60 + k * 30 - 40], [110, -60 + k * 30 - 40]], {w: 2, al: .35});
  c.restore();
}
function brickTowerT(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  sh(c, rr(-70, -300, 140, 300, 8), '#c0683f', {w: LINE});
  for (let yy = -280; yy < 0; yy += 22) mk(c, [[-66, yy], [66, yy]], {w: 2, al: .5});
  sh(c, [[-26, 0, 1], [-26, -120, 1], [0, -150, 1], [26, -120, 1], [26, 0, 1]], '#4a2a1c', {w: 4});
  let yy = -300, w = 140; for (let k = 0; k < 3; k++) { const nw = w * .72; sh(c, [[-w / 2 - 6, yy, 1], [-nw / 2, yy - 50, 1], [nw / 2, yy - 50, 1], [w / 2 + 6, yy, 1]], '#d17a4c', {w: LINE}); yy -= 50; w = nw; }
  sh(c, circ(0, yy - 12, 14, 14), '#d17a4c', {w: 4});
  c.restore();
}
function mountainT(c, x, y, s, t, {fall = true} = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  sh(c, [[-360, 0, 1], [-300, -160], [-220, -300], [-120, -380], [-40, -340], [40, -430], [150, -380], [250, -250], [330, -120], [380, 0, 1]], vgrad('#8cc08a', '#4f8a5a'), {w: LINE});
  for (const [px, py] of [[-160, -250], [60, -330], [200, -200], [-60, -160]]) treeT(c, px, py + 40, 70, {col: T.greenDk});
  if (fall) { sh(c, [[-40, -300, 1], [-10, -300, 1], [0, -40], [10, 0, 1], [-50, 0, 1], [-40, -40]], '#d4eef0', {w: 4.4}); for (let k = 0; k < 4; k++) { const yy = -300 + ((t * 160 + k * 75) % 300); mk(c, [[-30 + k * 6, yy], [-28 + k * 6, yy + 30]], {w: 3, color: T.waterDk}); } }
  c.restore();
}
// Cute royal galley: long hull, beast prow, rowers' heads, oars.
function boatT(c, x, y, s, t, {side = 'khmer', rowers = 5, crew = 2, dir = 1} = {}) {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  for (let k = 0; k < crew; k++) pp(c, -120 + k * 110, -40, .75, {body: side === 'khmer' ? T.red : T.navy, hat: side === 'khmer' ? 'band' : 'cham', arms: 'hold', mood: side === 'khmer' ? 'happy' : 'neutral', prop: {draw: PROPS.spear}, t});
  for (let k = 0; k < rowers; k++) { const rx = -180 + k * 70, ph = Math.sin(t * 4 + k * .3); c.save(); c.translate(rx, -30); sh(c, circ(0, -22, 20, 16), T.skin, {w: 4}); (HATS[side === 'khmer' ? 'hair' : 'cham'])(c, 20); face(c, 20, {mood: 'happy'}); c.restore(); mk(c, [[rx + 6, -30], [rx + 40 + ph * 20, 40]], {w: 8}); mk(c, [[rx + 6, -30], [rx + 40 + ph * 20, 40]], {w: 3.4, color: '#b48554'}); }
  sh(c, [[-280, -50, 1], [-220, -20], [220, -20], [290, -50, 1], [270, 10], [200, 30], [-200, 30], [-270, 10]], side === 'khmer' ? T.red : T.navy, {w: LINE});
  mk(c, [[-250, -20], [250, -20]], {w: 7, color: T.gold});
  const head = side === 'khmer' ? [[280, -46, 1], [300, -100], [330, -130], [360, -122, 1], [346, -108], [332, -80], [310, -40, 1]] : [[280, -46, 1], [296, -96], [318, -120], [352, -110, 1], [362, -96, 1], [330, -94], [312, -40, 1]];
  sh(c, head, T.gold, {w: LINE}); c.fillStyle = T.ol; c.beginPath(); c.arc(side === 'khmer' ? 336 : 330, side === 'khmer' ? -118 : -108, 4, 0, TAU); c.fill();
  sh(c, [[-280, -50, 1], [-310, -100], [-296, -110, 1], [-270, -70]], T.gold, {w: 4.4});
  c.restore();
}
function shipT(c, x, y, s, t, {sail = '#f1dfaf', flag = T.red, label = ''} = {}) {
  c.save(); c.translate(x, y + Math.sin(t * 2) * 4); c.rotate(Math.sin(t * 1.6) * .03); c.scale(s, s);
  mk(c, [[0, -40], [0, -250]], {w: 8});
  sh(c, [[-80, -230, 1], [80, -230, 1], [90 + Math.sin(t * 2) * 6, -70, 1], [-90 + Math.sin(t * 2) * 6, -70, 1]], sail, {w: LINE});
  for (let k = 1; k < 4; k++) mk(c, [[-84, -230 + k * 40], [84, -230 + k * 40]], {w: 2.6, al: .8});
  sh(c, [[0, -250, 1], [50, -238 + Math.sin(t * 5) * 4, 1], [0, -226, 1]], flag, {w: 3.4});
  sh(c, [[-170, -60, 1], [170, -60, 1], [130, 10], [-130, 10]], T.brown, {w: LINE});
  if (label) { c.font = `600 34px ${FONT.serif}`; c.textAlign = 'center'; c.fillStyle = T.ol; c.fillText(label, 0, -130); }
  c.restore();
}
function fireT(c, x, y, s, t, seed = 1) {
  const n = Math.floor(t * 12) % 3, r = rng(seed * 10 + n);
  c.save(); c.translate(x, y); c.scale(s, s);
  sh(c, [[-50, 0, 1], [-56, -50], [-30 + r() * 10, -90], [-20, -60], [0, -140 - r() * 20, 1], [16, -70], [34, -110 + r() * 10, 1], [52, -40], [50, 0, 1]], T.red, {w: LINE});
  sh(c, [[-28, 0, 1], [-30, -40], [-6 + r() * 6, -80, 1], [10, -40], [22, -64, 1], [30, -20], [28, 0, 1]], T.orange, {w: 4});
  sh(c, [[-12, 0, 1], [-10, -24], [2, -46, 1], [12, -20], [12, 0, 1]], T.yellow, {w: 3.6});
  c.restore();
}
function crocT(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s); const j = .15 + .15 * Math.sin(t * 5);
  sh(c, [[-160, -10, 1], [-60, -30], [40, -34], [60, -20], [60, 10], [-60, 16]], '#6f9a55', {w: LINE});
  for (let k = 0; k < 6; k++) sh(c, [[-120 + k * 28, -24, 1], [-108 + k * 28, -42, 1], [-96 + k * 28, -26, 1]], '#557c42', {w: 3});
  c.save(); c.translate(50, -16); c.rotate(-j); sh(c, [[0, -10, 1], [110, -14, 1], [110, 4, 1], [0, 6, 1]], '#6f9a55', {w: 4.4}); for (let k = 0; k < 6; k++) sh(c, [[14 + k * 16, 4, 1], [20 + k * 16, 12, 1], [26 + k * 16, 4, 1]], T.white, {w: 2}); sh(c, circ(20, -16, 10, 12), T.white, {w: 3.4}); c.fillStyle = T.ol; c.beginPath(); c.arc(22, -16, 4, 0, TAU); c.fill(); c.restore();
  c.save(); c.translate(50, -4); c.rotate(j); sh(c, [[0, 0, 1], [104, 6, 1], [100, 20, 1], [0, 16, 1]], '#5d8847', {w: 4.4}); c.restore();
  c.restore();
}
function confetti(c, x, y, t, t0, {n = 60, spread = 700, seed = 3} = {}) {
  const u = t - t0; if (u < 0 || u > 5) return;
  const cols = [T.red, T.teal, T.yellow, T.purple, T.pink, T.blue, T.white];
  for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (hash(k, seed) - .5) * 2.4, v = 300 + hash(k, seed + 1) * 500, px = x + Math.cos(a) * v * u * .9, py = y + Math.sin(a) * v * u + 260 * u * u; c.save(); c.translate(px, py); c.rotate(u * 6 + k); c.globalAlpha = clamp(4.2 - u, 0, 1); c.fillStyle = cols[k % cols.length]; c.fillRect(-9, -4, 18, 8); c.strokeStyle = T.ol; c.lineWidth = 1.6; c.strokeRect(-9, -4, 18, 8); c.restore(); }
}
function throneT(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); sh(c, rr(-80, -60, 160, 60, 8), T.gold, {w: LINE}); sh(c, rr(-60, -50, 120, 36, 6), T.red, {w: 4}); for (let k = 0; k < 4; k++) sh(c, circ(-39 + k * 26, -32, 6, 10), T.gold, {w: 3}); c.restore(); }
function blockT(c, x, y, w = 70, h = 50) { sh(c, [[x, y, 1], [x + w, y, 1], [x + w + 14, y - 10, 1], [x + w + 14, y - h - 10, 1], [x + 14, y - h - 10, 1], [x, y - h, 1]], T.stoneDk, {w: 4.4}); sh(c, rr(x, y - h, w, h, 4), T.stone, {w: 4.4}); }
function buddhaT(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let k = 0; k < 5; k++) sh(c, [[-90 + k * 36, 0, 1], [-72 + k * 36, -30, 1], [-54 + k * 36, 0, 1]], T.pink, {w: 3.6});
  sh(c, [[-80, -10, 1], [80, -10, 1], [60, -60], [0, -70], [-60, -60]], T.gold, {w: LINE});
  sh(c, [[-44, -60, 1], [-40, -150], [0, -170], [40, -150], [44, -60, 1]], T.gold, {w: LINE});
  sh(c, circ(0, -200, 36, 24), T.gold, {w: LINE}); sh(c, [[-8, -232, 1], [0, -262, 1], [8, -232, 1]], T.gold, {w: 4});
  for (const sg of [-1, 1]) { mk(c, [[sg * 8, -202], [sg * 20, -204]], {w: 4}); sh(c, rr(sg * 38 - 6, -214, 12, 38, 6), T.gold, {w: 3.4}); }
  mk(c, [[-10, -184], [0, -180], [10, -184]], {w: 4});
  c.restore();
}
// Cambodia's flag, waving on a pole.
function flagT(c, x, y, w, t, rise = 1) {
  const h = w * 2 / 3, top = lerp(y - 40, y - 460, easeInOutSine(clamp(rise, 0, 1)));
  mk(c, [[x, y], [x, y - 480]], {w: 11}); mk(c, [[x, y], [x, y - 480]], {w: 5, color: T.gold}); sh(c, circ(x, y - 486, 10, 12), T.gold, {w: 4});
  const n = 24;
  for (let k = 0; k < n; k++) { const u0 = k / n, u1 = (k + 1) / n, d = u => Math.sin(u * 5 - t * 5) * 10 * u; const px = x + u0 * w;
    const bands = [[0, .25, '#1e4fa8'], [.25, .75, '#d9283a'], [.75, 1, '#1e4fa8']];
    for (const [a, b, col] of bands) { c.fillStyle = col; c.fillRect(px, top + d(u0) + a * h, w / n + 1, (b - a) * h); } }
  c.save(); c.translate(x + w / 2, top + d2(t, .5) + h * .62); c.scale(w / 380, w / 380);
  c.fillStyle = '#fff'; c.strokeStyle = T.ol; c.lineWidth = 3;
  const tw = (dx, bh) => { c.beginPath(); c.moveTo(dx - 16, 0); c.lineTo(dx - 14, -bh * .5); c.lineTo(dx, -bh); c.lineTo(dx + 14, -bh * .5); c.lineTo(dx + 16, 0); c.closePath(); c.fill(); c.stroke(); };
  tw(-60, 60); tw(60, 60); tw(-30, 72); tw(30, 72); tw(0, 90); c.fillRect(-90, 0, 180, 22); c.strokeRect(-90, 0, 180, 22);
  c.restore();
  mk(c, [[x, top, 1], [x + w, top + d2(t, 1), 1], [x + w, top + h + d2(t, 1), 1], [x, top + h, 1], [x, top, 1]], {w: 4.4});
}
function d2(t, u) { return Math.sin(u * 5 - t * 5) * 10 * u; }
// A painted cloth map hanging from a rod; its contents are drawn by `draw`.
function hangingMap(c, x, y, w, h, drop, draw) {
  if (drop <= 0) return; const yy = lerp(-h - 80, y, easeOutBack(clamp(drop, 0, 1)));
  for (const sg of [-1, 1]) mk(c, [[x + sg * w * .4, -10], [x + sg * w * .4, yy]], {w: 3.4});
  const p = sh(c, rr(x - w / 2, yy, w, h, 6), '#f3e6c4', {w: LINE});
  c.save(); c.clip(p); c.translate(x - w / 2, yy); draw(c, w, h); c.restore();
  mk(c, curve(rr(x - w / 2, yy, w, h, 6), true), {w: LINE, close: true, raw: true});
  for (const yv of [yy, yy + h]) sh(c, rr(x - w / 2 - 20, yv - 9, w + 40, 18, 9), T.brown, {w: 4.4});
}
function gateT(c, x, y, s, grow, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  sh(c, rr(-260, -330, 520, 330, 8), T.stone, {w: LINE});
  for (let yy = -300; yy < 0; yy += 44) mk(c, [[-256, yy], [256, yy]], {w: 2.2, al: .5});
  sh(c, [[-70, 0, 1], [-70, -170, 1], [0, -230, 1], [70, -170, 1], [70, 0, 1]], '#4a3a2c', {w: LINE});
  bayonT(c, 0, -330, .5);
  // Roots of a silk-cotton tree creep over the gate.
  const roots = [[[-30, -520], [-120, -420], [-200, -300], [-230, -120], [-240, 0]], [[30, -520], [130, -430], [210, -300], [230, -120], [250, 0]], [[-10, -520], [-60, -380], [-110, -250], [-100, -100]], [[10, -520], [60, -400], [110, -260], [120, -120]]];
  if (grow > 0) {
    roots.forEach((q, k) => { const r = cutAt(smoothLine(q, 5, false), clamp(grow * 1.3 - k * .1, 0, 1)); if (r.length > 2) sh(c, strip(r, profile([[0, 44 - k * 6], [1, 8]]), false), '#d8cdb3', {w: 4.4}); });
    const g = clamp(grow * 1.2, 0, 1); sh(c, rr(-50, -520 - 120 * g, 100, 120 * g + 20, 20), '#d8cdb3', {w: LINE});
    if (g > .4) for (const [px, py, r] of [[-120, -700, 110], [80, -720, 120], [-20, -800, 110], [180, -650, 80], [-200, -640, 80]]) sh(c, circ(px, py + (1 - g) * 200, r * g, 20), T.greenDk, {w: LINE});
  }
  c.restore();
}

// ---------- hand lettering, arrows, sparkles (made for the pencil style, work in any) ----------
function handText(c, s, x, y, size, reveal = 1, {col = '#2f2d2a', al = 1, align = 'center', halo = true} = {}) {
  if (reveal <= 0 || al <= 0) return;
  c.save(); c.globalAlpha *= al; c.font = `${size}px ${FONT.ui}`; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  const w = c.measureText(s).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  c.beginPath(); c.rect(x0 - 10, y - size * 1.3, (w + 20) * clamp(reveal, 0, 1), size * 2); c.clip();
  if (halo) { c.shadowColor = '#f6f1e5'; c.shadowBlur = size * .4 * S; c.fillStyle = '#f6f1e5'; c.fillText(s, x0, y); c.shadowBlur = 0; }
  c.fillStyle = graphitePattern(c, col); c.fillText(s, x0, y); c.restore();
}
// arrowT: a pencil arrow from a to b that draws itself on (u 0..1), slightly bowed.
function arrowT(c, a, b, u, {bow = .18, w = 4} = {}) {
  if (u <= 0) return;
  const m = lerp2(a, b, .5), d = sub(b, a), mid = [m[0] - d[1] * bow, m[1] + d[0] * bow], q = smoothLine([a, mid, b], 4);
  const r = cutAt(q, clamp(u / .8, 0, 1)); if (r.length > 1) mk(c, r, {w, raw: true});
  if (u > .8) { const k = clamp((u - .8) / .2, 0, 1), e = q[q.length - 1], dir = norm(sub(e, q[q.length - 4])), L = 16 * k;
    mk(c, [add(e, mul(rot(dir, 2.6), L)), e, add(e, mul(rot(dir, -2.6), L))], {w, raw: true}); }
}
// pathArrow: a pencil stroke along any path q that draws itself on, with an arrowhead.
function pathArrow(c, q, u, {w = 4.4} = {}) {
  if (u <= 0) return; const r = cutAt(q, clamp(u / .85, 0, 1)); if (r.length > 1) mk(c, r, {w, raw: true});
  if (u > .85) { const k = clamp((u - .85) / .15, 0, 1), e = q[q.length - 1], dir = norm(sub(e, q[Math.max(0, q.length - 5)])), L = 18 * k; mk(c, [add(e, mul(rot(dir, 2.6), L)), e, add(e, mul(rot(dir, -2.6), L))], {w, raw: true}); }
}
function sparkle(c, x, y, s = 1, al = 1) { if (al <= 0) return; for (const a of [0, Math.PI / 2]) mk(c, [[x - Math.cos(a) * 14 * s, y - Math.sin(a) * 14 * s], [x + Math.cos(a) * 14 * s, y + Math.sin(a) * 14 * s]], {w: 3.4, al, color: T.goldDk}); }
