'use strict';
// The cast: `face` (expressions), `grandpa` (the built-in narrator design), `pp`
// (a boxy cut-out player with hats, arms, props), `elephantT`, `apsaraT`.
// Design a new narrator by copying `grandpa`: it must accept {mouth, blink, look,
// gesture, gp, walk, t, dir} so the director can drive it.

// Face features in local head coordinates (head radius r).
function face(c, r, {mood = 'happy', mouth = 0, blink = false, look = 0, cheeks = true} = {}) {
  const ex = r * .36, ey = -r * .05, w = Math.max(3, r * .09);
  if (blink || mood === 'happy') { for (const sg of [-1, 1]) mk(c, [[sg * ex - r * .13 + look * 3, ey + r * .04], [sg * ex + look * 3, ey - r * .1], [sg * ex + r * .13 + look * 3, ey + r * .04]], {w}); }
  else if (mood === 'star') { for (const sg of [-1, 1]) sh(c, xf([[0, -1, 1], [.25, -.25, 1], [1, 0, 1], [.25, .25, 1], [0, 1, 1], [-.25, .25, 1], [-1, 0, 1], [-.25, -.25, 1]], sg * ex, ey, r * .2), T.white, {w: w * .8, tex: false}); }
  else if (mood === 'sad') { for (const sg of [-1, 1]) { c.fillStyle = T.ol; c.beginPath(); c.arc(sg * ex + look * 3, ey, r * .075, 0, TAU); c.fill(); mk(c, [[sg * ex - r * .14, ey - r * .12 - sg * r * .06], [sg * ex + r * .14, ey - r * .18 + sg * r * .06]], {w: w * .7}); } }
  else { for (const sg of [-1, 1]) { c.fillStyle = T.ol; c.beginPath(); c.arc(sg * ex + look * 3, ey, r * .08, 0, TAU); c.fill(); } }
  const my = r * .38;
  if (mood === 'shock') sh(c, ell(0, my, r * .12, r * .16, 16), '#6b2a22', {w: w * .8, tex: false});
  else if (mood === 'sad') mk(c, [[-r * .18, my + r * .08], [0, my - r * .02], [r * .18, my + r * .08]], {w});
  else if (mood === 'neutral' && mouth <= .05) mk(c, [[-r * .14, my], [r * .14, my]], {w});
  else { const h = r * (.1 + .2 * Math.max(mood === 'happy' || mood === 'star' ? .5 : 0, mouth)); sh(c, [[-r * .22, my - h * .2, 1], [r * .22, my - h * .2, 1], [r * .14, my + h * .6], [0, my + h * .8], [-r * .14, my + h * .6]], '#6b2a22', {w: w * .8, tex: false}); }
  if (cheeks) for (const sg of [-1, 1]) { c.fillStyle = 'rgba(232,110,110,.35)'; c.beginPath(); c.ellipse(sg * r * .62, r * .22, r * .14, r * .09, 0, 0, TAU); c.fill(); }
}

// ---------- Grandpa Sok ----------
// st: {mouth 0..1, blink, look, gesture: 'rest'|'point'|'wave'|'open'|'bow', gp (gesture amount 0..1), walk (phase or null), t}
function grandpa(c, x, y, s, st = {}) {
  const {mouth = 0, blink = false, look = 0, gesture = 'rest', gp = 1, walk = null, t = 0, dir = 1} = st;
  const bob = walk === null ? Math.sin(t * 2.2) * 1.6 : -Math.abs(Math.sin(walk * Math.PI * 2)) * 5;
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  c.fillStyle = 'rgba(40,20,10,.18)'; c.beginPath(); c.ellipse(0, 2, 58, 11, 0, 0, TAU); c.fill();
  // Legs in dark trousers, leather sandals.
  const lg = k => { const ph = walk === null ? 0 : Math.sin(walk * TAU + k * Math.PI), dx = ph * 12, lift = walk === null ? 0 : Math.max(0, ph) * 8; return {dx, lift}; };
  for (const [sg, k] of [[-1, 0], [1, 1]]) { const {dx, lift} = lg(k); sh(c, rr(sg * 15 - 10 + dx, -62 - lift, 20, 56, 5), T.navy, {w: 4.4}); sh(c, ell(sg * 15 + dx + 4, -5 - lift, 17, 8, 16), T.brown, {w: 4}); }
  c.translate(0, bob);
  // Walking stick in the left hand.
  const stickTop = [-64, -104], stickBot = [-72 + (walk === null ? 0 : Math.sin(walk * TAU) * 10), -bob];
  // Arms: shoulder -> elbow -> hand, solved for fixed lengths.
  const hands = {
    rest: {l: [-62, -96], r: [48, -76]}, point: {l: [-62, -96], r: [104, -170]}, wave: {l: [-62, -96], r: [80 + Math.sin(t * 9) * 12, -206]},
    open: {l: [-66, -128], r: [74, -134]}, bow: {l: [-54, -92], r: [22, -118]},
  };
  const Hs = hands[gesture] || hands.rest, Hr = hands.rest, hr = lerp2(Hr.r, Hs.r, gp), hl = lerp2(Hr.l, Hs.l, gesture === 'open' ? gp : 0);
  const arm = (sh0, hand, bend) => { const L = twoBone(sh0, hand, 38, 36, bend); sh(c, strip([L.root, L.joint, L.end], profile([[0, 22], [.5, 18], [1, 15]])), T.white, {w: 4.4}); sh(c, circ(L.end[0], L.end[1], 11, 16), T.skin, {w: 4}); pin(c, add(L.root, [0, 3]), 5); return L.end; };
  inkLine(c, [stickTop, stickBot], {w: 13, color: T.ol}); inkLine(c, [stickTop, stickBot], {w: 7.5, color: '#9a6a3c'});
  sh(c, ell(stickTop[0] + 6, stickTop[1] - 2, 14, 8, 14), '#9a6a3c', {w: 4});
  arm([-34, -142], hl, -1);
  // Shirt.
  sh(c, [[-38, -150, 1], [38, -150, 1], [44, -56, 1], [-44, -56, 1]], T.white, {w: LINE});
  for (let k = 0; k < 3; k++) { c.fillStyle = T.ol; c.beginPath(); c.arc(4, -110 + k * 20, 2.6, 0, TAU); c.fill(); }
  sh(c, rr(14, -104, 18, 18, 4), T.white, {w: 3.2});
  // Krama: the red-and-white checked Khmer scarf, tied at the neck, ends on the chest.
  const krama = (pts) => { const p = sh(c, pts, T.red, {w: 4.2}); c.save(); c.clip(p); c.fillStyle = '#f6efe2'; for (let yy = -170; yy < -40; yy += 10) for (let xx = -60; xx < 60; xx += 10) if (((xx + yy) / 10) % 2 === 0) c.fillRect(xx, yy, 5, 5); c.restore(); mk(c, curve(pts, true), {w: 4.2, close: true, raw: true}); };
  krama([[-40, -150, 1], [-20, -136], [0, -132], [20, -136], [40, -150, 1], [30, -162], [0, -158], [-30, -162]]);
  krama([[-12, -140, 1], [-4, -140, 1], [-8, -96], [-18, -86, 1], [-26, -94]]);
  krama([[-2, -140, 1], [8, -140, 1], [10, -100], [2, -88, 1], [-6, -96]]);
  const handR = arm([34, -142], hr, gesture === 'point' || gesture === 'wave' ? 1 : -1);
  if (gesture === 'point' && gp > .5) mk(c, [handR, add(handR, [16, -10])], {w: 7});
  // Head: bald crown, white side tufts and brows, round glasses, a white moustache.
  c.save(); c.translate(0, -208); c.rotate(Math.sin(t * 1.3) * .03 + (gesture === 'bow' ? .12 * gp : 0));
  for (const sg of [-1, 1]) sh(c, circ(sg * 52, 6, 11, 14), T.skin, {w: 4.2});
  sh(c, circ(0, 0, 54, 30), T.skin, {w: LINE});
  for (const sg of [-1, 1]) sh(c, xf([[0, 0, 1], [6, -12], [16, -20], [22, -10], [30, -12], [30, 2], [24, 12], [8, 10]], sg * 30, -14, 1, 0, sg), '#f4f2ee', {w: 4.2});
  for (const [yy, ww] of [[-38, 14], [-31, 10]]) mk(c, [[-ww, yy], [0, yy - 2], [ww, yy]], {w: 2.6, al: .7});
  for (const sg of [-1, 1]) sh(c, [[sg * 8, -24, 1], [sg * 18, -30], [sg * 32, -28], [sg * 34, -22, 1], [sg * 20, -21]], '#f4f2ee', {w: 3.4});
  // Eyes behind the glasses.
  for (const sg of [-1, 1]) { if (blink) mk(c, [[sg * 20 - 6, -6], [sg * 20 + 6, -6]], {w: 3.6}); else { c.fillStyle = T.ol; c.beginPath(); c.arc(sg * 20 + look * 4, -6, 4.4, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(sg * 20 + look * 4 + 1.5, -7.5, 1.4, 0, TAU); c.fill(); } }
  for (const sg of [-1, 1]) { c.save(); c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.arc(sg * 20, -6, 15, 0, TAU); c.fill(); c.restore(); mk(c, circ(sg * 20, -6, 15, 24), {w: 4.2, close: true}); }
  mk(c, [[-6, -8], [0, -10], [6, -8]], {w: 3.6});
  sh(c, [[-5, 2], [0, -2], [7, 6], [2, 12], [-4, 10]], T.skinDk, {w: 3.6});
  for (const sg of [-1, 1]) { c.fillStyle = 'rgba(232,110,110,.4)'; c.beginPath(); c.ellipse(sg * 34, 12, 8, 5, 0, 0, TAU); c.fill(); }
  // Mouth opens with the voice, under the moustache; a little white goatee below.
  const m = clamp(mouth, 0, 1), mh = 3 + m * 15;
  if (m > .06) { sh(c, [[-13, 20, 1], [13, 20, 1], [10, 20 + mh * .7], [0, 20 + mh], [-10, 20 + mh * .7]], '#6b2a22', {w: 3.6, tex: false}); if (m > .35) sh(c, ell(0, 20 + mh * .78, 6, 3, 10), '#e38a8a', {w: 0, tex: false}); }
  else mk(c, [[-12, 21], [0, 25], [12, 21]], {w: 3.6});
  sh(c, [[-26, 18, 1], [-20, 10], [-8, 10], [0, 14], [8, 10], [20, 10], [26, 18, 1], [16, 22], [0, 18], [-16, 22]], '#f4f2ee', {w: 3.8});
  sh(c, [[-9, 38 + mh * .3], [0, 36 + mh * .3], [9, 38 + mh * .3], [2, 50 + mh * .3, 1], [-2, 50 + mh * .3, 1]], '#f4f2ee', {w: 3.4});
  c.restore();
  c.restore();
}

// ---------- the company ----------
// o: {body, skin, hat, mood, arms: 'down'|'up'|'pray'|'point'|'hold'|'row'|'dance', walk, t, h (height scale), prop}
const HATS = {
  mokot: (c, r) => { sh(c, [[-r * .7, -r * .62, 1], [r * .7, -r * .62, 1], [r * .62, -r * .9, 1], [-r * .62, -r * .9, 1]], T.gold, {w: 4}); sh(c, [[-r * .5, -r * .9, 1], [0, -r * 2.1, 1], [r * .5, -r * .9, 1]], T.gold, {w: 4.4}); for (const f of [.35, .65]) mk(c, [[-r * .5 * (1 - f), -r * (.9 + f * 1.2)], [r * .5 * (1 - f), -r * (.9 + f * 1.2)]], {w: 3}); sh(c, circ(0, -r * 2.16, r * .14, 12), T.gold, {w: 3.4}); },
  tiara: (c, r) => { for (const [dx, h] of [[-.45, 1.3], [0, 1.7], [.45, 1.3]]) sh(c, [[r * dx - r * .2, -r * .8, 1], [r * dx, -r * h, 1], [r * dx + r * .2, -r * .8, 1]], T.gold, {w: 3.6}); sh(c, [[-r * .7, -r * .62, 1], [r * .7, -r * .62, 1], [r * .64, -r * .86, 1], [-r * .64, -r * .86, 1]], T.gold, {w: 3.6}); },
  hair: (c, r) => sh(c, [[-r * .98, -r * .1, 1], [-r * .9, -r * .6], [-r * .4, -r * .98], [r * .3, -r * .98], [r * .9, -r * .6], [r * .98, -r * .1, 1], [r * .6, -r * .5], [0, -r * .6], [-r * .6, -r * .5]], '#2a211c', {w: 4}),
  bun: (c, r) => { sh(c, circ(0, -r * 1.05, r * .34, 16), '#2a211c', {w: 4}); HATS.hair(c, r); },
  band: (c, r) => { HATS.hair(c, r); sh(c, [[-r, -r * .5, 1], [r, -r * .5, 1], [r * .96, -r * .28, 1], [-r * .96, -r * .28, 1]], T.red, {w: 3.6}); },
  cham: (c, r) => { sh(c, [[-r * .9, -r * .45, 1], [r * .9, -r * .45, 1], [r * .8, -r * .8, 1], [-r * .8, -r * .8, 1]], T.teal, {w: 4}); for (let k = -2; k <= 2; k++) sh(c, [[k * r * .3 - r * .16, -r * .78, 1], [k * r * .42, -r * (1.45 - Math.abs(k) * .12), 1], [k * r * .3 + r * .16, -r * .78, 1]], k % 2 ? T.orange : T.yellow, {w: 3.4}); },
  bald: () => {},
  futou: (c, r) => { sh(c, [[-r * .95, -r * .2, 1], [-r * .85, -r * .8], [0, -r * 1.05], [r * .85, -r * .8], [r * .95, -r * .2, 1]], '#2a211c', {w: 4}); for (const sg of [-1, 1]) sh(c, [[sg * r * .8, -r * .66, 1], [sg * r * 1.9, -r * .74, 1], [sg * r * 1.9, -r * .56, 1], [sg * r * .8, -r * .5, 1]], '#2a211c', {w: 3.4}); },
  helmet: (c, r) => { sh(c, [[-r * 1.02, -r * .1, 1], [-r * .9, -r * .7], [0, -r * 1.1], [r * .9, -r * .7], [r * 1.02, -r * .1, 1]], T.greyDk, {w: 4}); sh(c, [[-r * .12, -r * 1.08, 1], [0, -r * 1.6, 1], [r * .12, -r * 1.08, 1]], T.red, {w: 3.4}); },
};
const PPK = 1.3;
function pp(c, x, y, s, o = {}) {
  const {body = T.red, skin = T.skin, hat = 'hair', mood = 'happy', arms = 'down', walk = null, t = 0, dir = 1, mouth = 0, robe = false, skirt = false, prop = null, look = 0, blink = false} = o;
  c.save(); c.translate(x, y); c.scale(s * dir * PPK, s * PPK);
  const bob = walk === null ? Math.sin(t * 2 + x * .01) * 1.4 : -Math.abs(Math.sin(walk * Math.PI * 2)) * 4;
  c.fillStyle = 'rgba(40,20,10,.16)'; c.beginPath(); c.ellipse(0, 2, 34, 7, 0, 0, TAU); c.fill();
  for (const [sg, k] of [[-1, 0], [1, 1]]) { const ph = walk === null ? 0 : Math.sin(walk * TAU + k * Math.PI), dx = ph * 8, lift = walk === null ? 0 : Math.max(0, ph) * 6; if (!robe) sh(c, rr(sg * 11 - 7 + dx, -36 - lift, 14, 36, 4), skin, {w: 4}); else sh(c, ell(sg * 11 + dx + 3, -4 - lift, 10, 5, 12), skin, {w: 3.4}); }
  c.translate(0, bob);
  const sho = {l: [-24, -86], r: [24, -86]};
  const H = {down: {l: [-32, -50], r: [32, -50]}, up: {l: [-44, -128], r: [44, -128]}, pray: {l: [-4, -86], r: [4, -86]}, point: {l: [-32, -50], r: [62, -104]}, hold: {l: [-32, -50], r: [36, -84]}, row: {l: [40, -62], r: [44, -58]}, cheer: {l: [-40, -118 + Math.sin(t * 8) * 8], r: [40, -118 + Math.cos(t * 8) * 8]}}[arms] || {};
  const limb = (k, back) => { if (!H[k]) return null; const L = twoBone(sho[k], H[k], 22, 22, k === 'l' ? -1 : 1); sh(c, strip([L.root, L.joint, L.end], profile([[0, 13], [1, 11]])), robe ? body : skin, {w: 3.8}); sh(c, circ(L.end[0], L.end[1], 7, 12), skin, {w: 3.4}); pin(c, add(L.root, [0, 2]), 3.4); return L.end; };
  if (prop && prop.behind) prop.draw(c);
  const hl = limb('l');
  // Body: a boxy tunic (robe or skirt reach lower), cloth band at the waist.
  if (robe) sh(c, [[-26, -94, 1], [26, -94, 1], [32, -2, 1], [-32, -2, 1]], body, {w: LINE});
  else if (skirt) { sh(c, [[-24, -94, 1], [24, -94, 1], [26, -54, 1], [-26, -54, 1]], skin, {w: LINE}); sh(c, [[-26, -58, 1], [26, -58, 1], [28, -8, 1], [-28, -8, 1]], body, {w: LINE}); mk(c, [[-26, -58], [26, -58]], {w: 7, color: T.gold}); }
  else { sh(c, [[-24, -94, 1], [24, -94, 1], [26, -54, 1], [-26, -54, 1]], skin, {w: LINE}); sh(c, [[-27, -60, 1], [27, -60, 1], [29, -30, 1], [0, -26], [-29, -30, 1]], body, {w: LINE}); }
  if (robe) mk(c, [[-18, -92], [22, -40]], {w: 3, al: .7});
  if (hat === 'mokot' || hat === 'tiara') sh(c, [[-22, -94, 1], [22, -94, 1], [14, -80], [0, -76], [-14, -80]], T.gold, {w: 3.6});
  if (!robe) for (const sg of [-1, 1]) pin(c, [sg * 11, -40], 3);
  // Head.
  c.save(); c.translate(0, -124);
  sh(c, circ(0, 0, 30, 24), skin, {w: LINE});
  (HATS[hat] || HATS.hair)(c, 30);
  face(c, 30, {mood, mouth, look, blink});
  c.restore();
  const hr = limb('r');
  if (prop && !prop.behind) prop.draw(c, hr, hl);
  c.restore();
}
// Props held in a hand (hand given in the figure's local space).
const PROPS = {
  spear: (c, h) => { if (!h) return; mk(c, [[h[0] - 4, h[1] + 60], [h[0] + 6, h[1] - 90]], {w: 9}); mk(c, [[h[0] - 4, h[1] + 60], [h[0] + 6, h[1] - 90]], {w: 4, color: '#b48554'}); sh(c, [[h[0] + 1, h[1] - 88, 1], [h[0] + 7, h[1] - 118, 1], [h[0] + 13, h[1] - 88, 1]], '#d8d5cc', {w: 3.4}); },
  parasol: (c, h) => { if (!h) return; mk(c, [[h[0], h[1] + 30], [h[0], h[1] - 120]], {w: 8}); mk(c, [[h[0], h[1] + 30], [h[0], h[1] - 120]], {w: 3.4, color: T.gold}); for (let k = 0; k < 3; k++) sh(c, [[h[0] - 44 + k * 10, h[1] - 118 - k * 22, 1], [h[0], h[1] - 146 - k * 22, 1], [h[0] + 44 - k * 10, h[1] - 118 - k * 22, 1]], T.white, {w: 4}); },
  bowl: (c, h) => { if (!h) return; sh(c, [[h[0] - 16, h[1] - 8, 1], [h[0] + 16, h[1] - 8, 1], [h[0] + 12, h[1] + 8], [h[0] - 12, h[1] + 8]], '#3a2f28', {w: 3.6}); },
  oar: (c, h) => { if (!h) return; mk(c, [[h[0] - 6, h[1]], [h[0] + 50, h[1] + 90]], {w: 8}); mk(c, [[h[0] - 6, h[1]], [h[0] + 50, h[1] + 90]], {w: 3.4, color: '#b48554'}); },
  scroll: (c, h) => { if (!h) return; sh(c, rr(h[0] - 4, h[1] - 16, 36, 26, 4), '#f3e7c8', {w: 3.4}); },
  shield: (c) => { sh(c, [[-4, -100, 1], [30, -100, 1], [32, -52], [13, -36, 1], [-6, -52]], T.orange, {w: 4}); sh(c, circ(13, -72, 6, 12), T.gold, {w: 3}); },
};

// Elephant, cut-out style (facing +x, feet on y = 0).
function elephantT(c, x, y, s, ph, {cloth = T.red, rider = null, walk = true, gold = false} = {}) {
  c.save(); c.translate(x, y); c.scale(s * 1.2, s * 1.2);
  c.fillStyle = 'rgba(40,20,10,.16)'; c.beginPath(); c.ellipse(0, 2, 150, 16, 0, 0, TAU); c.fill();
  for (const [lx, k] of [[-80, 0], [60, .5], [-50, .5], [90, 0]]) { const ph2 = walk ? Math.sin((ph + k) * TAU) : 0; sh(c, rr(lx - 20 + ph2 * 10, -100 - Math.max(0, ph2) * 6, 40, 100, 8), k ? T.grey : T.greyDk, {w: LINE}); }
  sh(c, rr(-130, -230, 250, 150, 60), T.grey, {w: LINE});
  sh(c, [[-80, -232, 1], [60, -232, 1], [70, -140, 1], [-90, -140, 1]], cloth, {w: LINE}); mk(c, [[-86, -150], [66, -150]], {w: 8, color: T.gold}); for (let k = 0; k < 4; k++) sh(c, circ(-50 + k * 34, -190, 8, 12), T.gold, {w: 3.4});
  mk(c, [[-126, -170], [-150, -110]], {w: 6});
  const sw = walk ? Math.sin(ph * TAU) * 10 : Math.sin(ph * TAU) * 4;
  sh(c, strip([[140, -180], [170, -120], [168 + sw * .5, -60], [180 + sw, -20]], profile([[0, 44], [.6, 26], [1, 18]])), T.grey, {w: LINE});
  sh(c, circ(118, -200, 70, 30), T.grey, {w: LINE});
  sh(c, [[70, -250], [40, -230], [40, -160], [80, -140], [100, -180]], T.greyDk, {w: LINE});
  sh(c, [[150, -168, 1], [196, -150], [200, -140, 1], [160, -150]], gold ? T.gold : T.white, {w: 3.6});
  c.save(); c.translate(128, -210); face(c, 40, {mood: 'happy', cheeks: true}); c.restore();
  sh(c, [[100, -270, 1], [130, -300], [150, -266, 1]], T.gold, {w: 3.6});
  if (rider) { c.save(); c.translate(-10, -230); rider(c); c.restore(); }
  c.restore();
}
// A dancing apsara, frontal, arms in the classical curves.
function apsaraT(c, x, y, s, t, {body = T.red} = {}) {
  const k = Math.sin(t * 1.4), up = .5 + .5 * k;
  c.save(); c.translate(x, y); c.scale(s * PPK, s * PPK);
  c.fillStyle = 'rgba(40,20,10,.16)'; c.beginPath(); c.ellipse(0, 2, 34, 7, 0, 0, TAU); c.fill();
  sh(c, rr(-18, -34, 14, 34, 4), T.skin, {w: 4}); c.save(); c.translate(12, -20 - up * 16); c.rotate(-.6 - up * .4); sh(c, rr(-7, -20, 14, 34, 4), T.skin, {w: 4}); c.restore();
  const armL = [[-24, -86], [-54, -100 - up * 20], [-50, -140 - up * 10]], armR = [[24, -86], [54, -70 + up * 20], [70, -86 + up * 12]];
  for (const a of [armL, armR]) { sh(c, strip(a, profile([[0, 12], [1, 10]])), T.skin, {w: 3.8}); const e = a[2]; sh(c, [[e[0] - 7, e[1] + 4, 1], [e[0] - 4, e[1] - 10], [e[0] + 6, e[1] - 14, 1], [e[0] + 8, e[1] - 4], [e[0] + 7, e[1] + 4, 1]], T.skin, {w: 3.4}); }
  sh(c, [[-24, -94, 1], [24, -94, 1], [26, -54, 1], [-26, -54, 1]], T.skin, {w: LINE});
  sh(c, [[-22, -94, 1], [22, -94, 1], [16, -72], [0, -66], [-16, -72]], T.gold, {w: 3.6});
  sh(c, [[-26, -58, 1], [26, -58, 1], [30, -10, 1], [-30, -10, 1]], body, {w: LINE}); mk(c, [[-26, -58], [26, -58]], {w: 7, color: T.gold}); sh(c, [[-6, -58, 1], [6, -58, 1], [4, -12, 1], [-4, -12, 1]], T.gold, {w: 3});
  c.save(); c.translate(0, -124); c.rotate(-.1 * k); sh(c, circ(0, 0, 30, 24), T.skin, {w: LINE}); HATS.hair(c, 30); HATS.tiara(c, 30); face(c, 30, {mood: 'happy'}); for (const sg of [-1, 1]) sh(c, circ(sg * 32, 14, 6, 10), T.white, {w: 3}); c.restore();
  c.restore();
}
