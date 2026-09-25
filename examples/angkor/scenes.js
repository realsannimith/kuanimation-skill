'use strict';
// Angkor: The Rise and Fall of the Khmer Empire — fourteen scenes in action style: the
// players act the history out while an unseen storyteller (Grandpa Sok's voice) speaks.
// Each scene: {name, mood, holds, camera?, set(c, tau, S)}. L(i) is the start of voice
// line i; every action is timed to the lines, never to fixed seconds.
const SCENES = [
  {name: 'intro', mood: 'warm', post: 1.6, set(c, tau, S) {
    const L = L_(S);
    sunBurst(c, 960, 430, 90, tau, {col: T.yellow});
    rise(c, span(L(1), L(1) + 1.2, tau), g => angkorFlat(g, 960, 760, .62));
    signBoard(c, 960, 70, 560, 150, 'អង្គរ', {font: FONT.khmer, size: 96, drop: span(L(1) + .6, L(1) + 1.4, tau)});
    signBoard(c, 960, 250, 820, 70, 'ANGKOR · The Rise and Fall of the Khmer Empire', {size: 34, fill: T.red, drop: span(L(2), L(2) + .8, tau)});
    confetti(c, 960, 300, tau, L(2) + .6);
    for (let k = 0; k < 2; k++) { const p = travel(tau, L(2) - .2 + k * .3, L(2) + 1.4 + k * .3, [-120 - k * 120, 890], [360 + k * 130, 890], easeOut); const moving = tau < L(2) + 1.4 + k * .3; pp(c, p[0], p[1], .8, {body: [T.teal, T.orange][k], hat: k ? 'bun' : 'hair', skirt: k === 1, arms: moving ? 'down' : 'cheer', walk: moving ? stepPhase(p[0]) : null, t: tau + k}); if (moving && p[0] > -60) speedLines(c, p[0] - 30, 800, 1, {n: 4, len: 80, spread: 80}); emote(c, tau, L(2) + 1.5 + k * .3, p[0], 620, 'heart', {t1: L(2) + 4}); }
  }},
  {name: 'funan', mood: 'sea', set(c, tau, S) {
    const L = L_(S);
    cloudT(c, 1500, 180, 1); cloudT(c, 620, 140, .8);
    waveRoller(c, 560, tau, {ph: 0, h: 220});
    const sx = lerp(-300, 760, span(L(0) - .5, L(1), tau, easeInOutSine)), jx = lerp(2250, 1260, span(L(1) - .6, L(1) + 3, tau, easeInOutSine));
    shipT(c, sx, 640, .78, tau, {sail: '#f1dfaf', label: 'India'});
    c.save(); c.translate(jx, 0); c.scale(-1, 1); shipT(c, 0, 648, .72, tau + 1, {sail: '#e08a5a', flag: T.yellow}); c.restore();
    mapLabelT(c, 'China', jx, 500, span(L(1), L(1) + 1, tau));
    waveRoller(c, 640, tau, {ph: 2, h: 160, col: '#86c3d3'});
    stiltHouse(c, 1560, 780, .8); stiltHouse(c, 1680, 790, .7, {col: T.yellow});
    const gone = 1 - span(L(2) - .4, L(2), tau);
    onStick(c, 720, 330, g => { sh(g, circ(0, 0, 62, 26), T.red, {w: LINE}); buddhaT(g, 0, 50, .36); }, span(L(1) + 1, L(1) + 1.5, tau) * gone);
    onStick(c, 920, 300, g => { sh(g, circ(0, 0, 62, 26), T.teal, {w: LINE}); for (let k = 0; k < 5; k++) sh(g, xf([[0, 0, 1], [-12, -30], [0, -50, 1], [12, -30]], 0, 26, 1, (k - 2) * .5), T.pink, {w: 3.4}); }, span(L(1) + 1.4, L(1) + 1.9, tau) * gone);
    onStick(c, 1120, 330, g => { sh(g, circ(0, 0, 62, 26), T.yellow, {w: LINE}); sh(g, rr(-40, -16, 80, 32, 6), '#f3e6c4', {w: 4}); for (let k = 0; k < 3; k++) mk(g, [[-28, -6 + k * 7], [28, -6 + k * 7]], {w: 2.2}); }, span(L(1) + 1.8, L(1) + 2.3, tau) * gone);
    rise(c, span(L(2), L(2) + 1, tau), g => brickTowerT(g, 1200, 780, .9));
    signBoard(c, 1200, 60, 460, 80, 'Sambor Prei Kuk', {size: 34, drop: span(L(2) + .5, L(2) + 1.2, tau) * (1 - span(L(3) - .3, L(3), tau))});
    const cols = [T.red, T.navy, T.teal, T.purple, T.orange];
    for (let k = 0; k < 5; k++) { const p = pop(tau, L(3) + k * .25); if (p <= 0) continue; c.save(); c.translate(560 + k * 150, 870); c.scale(p, p); pp(c, 0, 0, .8, {body: cols[k], hat: 'mokot', mood: k % 2 ? 'sad' : 'neutral', arms: 'hold', dir: k % 2 ? -1 : 1, t: tau, prop: {draw: (g, h) => { if (!h) return; mk(g, [[h[0], h[1] + 20], [h[0], h[1] - 110]], {w: 6}); sh(g, [[h[0], h[1] - 110, 1], [h[0] + 50, h[1] - 96, 1], [h[0], h[1] - 80, 1]], cols[(k + 2) % 5], {w: 3.4}); }}}); c.restore(); }
    emote(c, tau, L(3) + 1.2, 560, 610, 'anger', {t1: L(3) + 3.2}); emote(c, tau, L(3) + 1.5, 860, 610, 'anger', {t1: L(3) + 3.2}); emote(c, tau, L(3) + 1.8, 1160, 610, '?', {t1: L(3) + 3.2});
  }},
  {name: 'kulen', mood: 'dawn', holds: {1: 1.2}, set(c, tau, S) {
    const L = L_(S);
    sunBurst(c, 1300, lerp(600, 280, span(0, L(1), tau, easeOut)), 80, tau);
    mountainT(c, 620, 770, .95, tau);
    throneT(c, 1020, 880, 1.1);
    const cheer = tau > L(1) + 2.2;
    pp(c, 1020, 818, 1.15, {body: T.red, hat: 'mokot', arms: cheer ? 'up' : 'pray', mood: cheer ? 'star' : 'happy', t: tau});
    for (const [x, d] of [[860, 1], [1300, -1]]) pp(c, x, 860, .95, {body: d > 0 ? T.navy : T.teal, hat: 'hair', arms: 'hold', dir: d, t: tau, prop: {draw: PROPS.parasol}});
    const pour = span(L(0) + .4, L(0) + 1.2, tau) * (1 - span(L(1) + 1, L(1) + 1.6, tau));
    pp(c, 1170, 860, 1, {body: T.white, hat: 'bun', arms: pour > .3 ? 'point' : 'down', dir: -1, t: tau, mood: 'happy', prop: {draw: (g, h) => { if (h) sh(g, [[h[0] - 4, h[1] - 10, 1], [h[0] + 30, h[1] - 16], [h[0] + 44, h[1] - 4, 1], [h[0] + 20, h[1] + 8]], '#fbf3e3', {w: 3.6}); }}});
    if (pour > .3) { const a = [1170 - 100, 860 - 108], b = [1020, 818 - 140 * 1.15 - 40], q = []; for (let k = 0; k <= 16; k++) { const u = k / 16; q.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 50 * Math.sin(Math.PI * u)]); } const r = cutAt(smoothLine(q, 3, false), span(0, 1, pour * 1.3)); if (r.length > 1) { mk(c, r, {w: 14}); mk(c, r, {w: 8, color: '#bfe6ee'}); } }
    for (let k = 0; k < 3; k++) pp(c, 1460 + k * 100, 880, .85, {body: [T.orange, T.purple, T.green][k], hat: k === 1 ? 'bun' : 'hair', skirt: k === 1, arms: tau > L(2) ? 'cheer' : 'pray', mood: 'happy', dir: -1, t: tau + k});
    confetti(c, 1020, 520, tau, L(1) + 2.2); confetti(c, 1020, 520, tau, L(2) + .4, {seed: 9});
    signBoard(c, 1020, 60, 520, 84, 'ភ្នំគូលេន · 802', {font: FONT.khmer, size: 50, drop: span(.4, 1.2, tau)});
    emote(c, tau, L(1) + 2.3, 1020, 480, '!', {t1: L(1) + 3.6}); for (let k = 0; k < 3; k++) emote(c, tau, L(2) + .3 + k * .2, 1460 + k * 100, 610, 'heart', {t1: L(2) + 3});
  }},
  {name: 'water', mood: 'green', holds: {1: .6, 2: .8}, set(c, tau, S) {
    const L = L_(S);
    hangingMap(c, 1010, 80, 1080, 560, span(L(0) - .6, L(0) + .4, tau), (g, w, h) => {
      g.fillStyle = '#d9d69a'; g.fillRect(0, 0, w, h);
      const green = span(L(2) + .5, L(3) + 1.5, tau);
      for (let yy = 30; yy < h - 20; yy += 34) for (let xx = 20; xx < w - 20; xx += 44) { if (xx > 430 && xx < 650 && yy > 170 && yy < 390) continue; if ((xx > 640 && yy < 170) || (xx < 440 && yy > 230 && yy < 330)) continue; const d = Math.hypot(xx - w / 2, yy - h / 2) / 700; g.fillStyle = green > d ? '#8fc46d' : '#e6d49a'; g.fillRect(xx, yy, 38, 28); g.strokeStyle = T.ol; g.lineWidth = 1.6; g.strokeRect(xx, yy, 38, 28); }
      const bar = (x, y, bw, bh, p) => { sh(g, rr(x, y, bw, bh, 8), '#c9b27a', {w: 4}); if (p > 0) sh(g, rr(x + 6, y + 6, (bw - 12) * p, bh - 12, 6), T.water, {w: 3}); };
      bar(660, 60, 380, 100, span(L(1), L(1) + 1.6, tau)); bar(40, 240, 390, 100, span(L(1) + .9, L(1) + 2.5, tau));
      mk(g, curve(rr(440, 180, 200, 200, 6), true), {w: 9, color: T.waterDk, close: true, raw: true});
      g.save(); g.translate(540, 300); budTower(g, -40, 0, 30, 70); budTower(g, 40, 0, 30, 70); budTower(g, 0, 0, 40, 100); g.restore();
      const cp = span(L(2), L(2) + 1.2, tau);
      for (const q of [[[640, 110], [640, 280]], [[850, 160], [850, 520]], [[230, 340], [230, 540]], [[540, 380], [540, 540]]]) { const r = cutAt([q[0], lerp2(q[0], q[1], .5), q[1]], cp); if (r.length > 1) { mk(g, r, {w: 10, raw: true}); mk(g, r, {w: 5, color: T.water, raw: true}); } }
      for (let k = 0; k < 40; k++) { const p = pop(tau, L(3) + .6 + k * .04, .3); if (p <= 0) continue; const px = 60 + hash(k, 3) * (w - 120), py = 40 + hash(k, 4) * (h - 80); g.fillStyle = [T.red, T.navy, T.orange][k % 3]; g.beginPath(); g.arc(px, py, 7 * p, 0, TAU); g.fill(); g.strokeStyle = T.ol; g.lineWidth = 2; g.stroke(); }
      g.font = `600 26px ${FONT.serif}`; g.fillStyle = T.ol; g.textAlign = 'center'; g.fillText('Phnom Bakheng', 540, 360);
      g.fillText('East Baray', 850, 190); g.fillText('West Baray', 235, 370);
    });
    const rainP = span(L(1) - .3, L(1) + .3, tau) * (1 - span(L(2) + .8, L(2) + 1.4, tau));
    for (const [x, y] of [[780, 250], [1260, 230]]) onStick(c, x, y, g => { cloudT(g, 0, 0, 1.1, {col: '#d4dfe6'}); for (let k = 0; k < 8; k++) { const yy = 30 + ((tau * 300 + k * 37) % 120); mk(g, [[-56 + k * 16, yy], [-60 + k * 16, yy + 22]], {w: 3.4, color: T.waterDk}); } }, rainP);
    for (let k = 0; k < 4; k++) { const p = pop(tau, L(3) + k * .2); if (p > 0) { c.save(); c.translate(760 + k * 150, 880); c.scale(p, p); pp(c, 0, 0, .8, {body: [T.red, T.teal, T.orange, T.purple][k], hat: k % 2 ? 'bun' : 'hair', skirt: k % 2 === 1, arms: 'cheer', t: tau + k}); c.restore(); } }
    pp(c, 460, 880, .85, {body: T.orange, hat: 'hair', arms: tau > L(2) ? 'cheer' : 'down', mood: tau > L(1) + 1 ? 'happy' : 'neutral', t: tau}); bubble(c, tau, L(1) + .2, L(2), 560, 560, (g) => { sh(g, [[0, -40, 1], [22, 0], [14, 26], [0, 32], [-14, 26], [-22, 0]], T.water, {w: 4}); }, {w: 150, h: 120, think: true, tail: [-70, 110]});
  }},
  {name: 'build', mood: 'gold', holds: {2: 1.2, 3: .8}, set(c, tau, S) {
    const L = L_(S), up = keys(tau, [[L(0), .25, easeInOutSine], [L(4), 1]]);
    if (tau > L(4)) sunBurst(c, 1060, 300, 100, tau);
    c.save(); c.beginPath(); c.rect(0, 0, W, STG.floorY + 2); c.clip(); c.translate(0, (1 - up) * 460); angkorFlat(c, 1060, 760, .8);
    if (up < .99) { c.globalAlpha = 1; for (let x = 700; x <= 1420; x += 60) mk(c, [[x, 760], [x, 330]], {w: 6, color: '#a8773f'}); for (let y = 700; y > 330; y -= 70) mk(c, [[680, y], [1440, y]], {w: 6, color: '#a8773f'}); }
    c.restore();
    pp(c, 1600, 870, 1.05, {body: T.red, hat: 'mokot', arms: tau > L(0) && tau < L(1) ? 'point' : 'down', dir: -1, t: tau, mood: tau > L(4) ? 'star' : 'happy'});
    pp(c, 1700, 880, .9, {body: T.navy, hat: 'hair', arms: 'hold', dir: -1, t: tau, prop: {draw: PROPS.parasol}});
    // Porters carry a block slung from a pole.
    const cx = lerp(200, 1500, ((tau - L(1)) / 7) % 1);
    if (tau > L(1) && tau < L(3) + 2) { const ph = cx / 80; pp(c, cx, 900, .8, {body: T.orange, arms: 'hold', walk: ph, t: tau}); pp(c, cx + 150, 900, .8, {body: T.teal, arms: 'hold', walk: ph + .5, t: tau}); mk(c, [[cx + 20, 830], [cx + 140, 830]], {w: 8, color: '#8a5a34'}); mk(c, [[cx + 80, 830], [cx + 80, 846]], {w: 3}); blockT(c, cx + 50, 890, 60, 44); }
    // Then an elephant hauls a sledge.
    if (tau > L(2) - .5) { const ex = lerp(-300, 1300, (tau - L(2) + .5) / 9); blockT(c, ex - 360, 880, 110, 70); sh(c, rr(ex - 380, 880, 160, 14, 5), T.brown, {w: 4}); mk(c, [[ex - 220, 850], [ex - 120, 800]], {w: 3.4}); elephantT(c, ex, 890, .55, tau * .8, {rider: g => pp(g, 0, 0, .9, {body: T.navy, hat: 'hair', arms: 'point'})}); }
    const yr = Math.round(keys(tau, [[L(3) - .3, 1113, t => t], [L(4), 1150]]));
    signBoard(c, 1060, 56, 420, 86, (tau > L(4) ? 'c. ' : '') + yr + ' CE', {size: 50, drop: span(.3, 1, tau)});
    signBoard(c, 1500, 190, 380, 70, 'Mount Meru', {size: 34, fill: T.red, drop: span(L(4) + .6, L(4) + 1.2, tau)});
    confetti(c, 1060, 300, tau, L(4) + .4);
    bubble(c, tau, L(0) + .4, L(1), 1440, 600, (g) => { g.save(); g.scale(.13, .13); angkorFlat(g, 0, 190, 1); g.restore(); }, {w: 230, h: 150, tail: [100, 110]}); emote(c, tau, L(4) + .4, 1600, 600, '!', {t1: L(4) + 2});
  }},
  {name: 'churn', mood: 'milk', camera: (tau, S) => ({x: 960, y: lerp(600, 640, span(S.beats(1), S.beats(1) + 2, tau)), zoom: lerp(1, 1.12, span(S.beats(1), S.beats(2) + 1, tau, easeInOutSine))}), holds: {2: 1.5}, set(c, tau, S) {
    const L = L_(S), tug = Math.sin(tau * 2.4) * 22, fade = 1 - span(L(1) + 1.6, L(1) + 2.4, tau) * .55;
    c.save(); c.globalAlpha = fade;
    sh(c, [[900, 760, 1], [930, 520], [960, 460, 1], [990, 520], [1020, 760, 1]], vgrad('#8cc08a', '#4f8a5a'), {w: LINE});
    sh(c, ell(960, 760, 120, 40, 20, Math.PI, TAU).concat([[1080, 760, 1], [840, 760, 1]]), '#6f9a55', {w: LINE});
    const body = []; for (let x = 260; x <= 1560; x += 20) body.push([x + tug, 620 + Math.sin(x / 90 + tau * 2) * 16]);
    sh(c, strip(body, profile([[0, 50], [.9, 40], [1, 8]])), '#5aa35a', {w: LINE});
    for (let k = 0; k < 7; k++) { const a = Math.PI + (k - 3) * .38, hx = 250 + tug + Math.cos(a) * 70, hy = 600 + Math.sin(a) * 80 - 20; sh(c, circ(hx, hy, 20, 16), '#5aa35a', {w: 4}); c.fillStyle = T.ol; c.beginPath(); c.arc(hx - 6, hy - 3, 3, 0, TAU); c.arc(hx + 6, hy - 3, 3, 0, TAU); c.fill(); }
    for (let k = 0; k < 4; k++) { c.save(); c.translate(380 + k * 120 + tug, 800); c.rotate(-.22 + Math.sin(tau * 2.4) * .05); pp(c, 0, 0, .85, {body: T.purple, skin: '#8fb0d8', hat: 'helmet', arms: 'row', mood: 'neutral', t: tau}); c.restore(); }
    for (let k = 0; k < 4; k++) { c.save(); c.translate(1180 + k * 120 + tug, 800); c.rotate(.22 + Math.sin(tau * 2.4) * .05); pp(c, 0, 0, .85, {body: T.red, hat: 'mokot', arms: 'row', mood: 'happy', dir: -1, t: tau}); c.restore(); }
    c.restore();
    waveRoller(c, 820, tau, {col: '#f7f4ec', dk: '#cfe3e0', h: 240, ph: 1});
    for (let k = 0; k < 3; k++) { const p = span(L(1) + .2 + k * .3, L(1) + 1.4 + k * .3, tau); if (p > 0) { c.save(); c.beginPath(); c.rect(0, 0, W, 850); c.clip(); apsaraT(c, 760 + k * 200, lerp(1060, 860, easeOutBack(p)), 1.05, tau + k * .4, {body: [T.red, T.teal, T.purple][k]}); c.restore(); } }
    confetti(c, 960, 500, tau, L(2) + .3, {n: 50});
    for (let k = 0; k < 2; k++) emote(c, tau, L(2) + .4 + k * .3, 1180 + k * 240, 560, 'heart', {t1: L(2) + 2.6});
  }},
  {name: 'cham', mood: 'night', camera: (tau, S) => ({...DEFAULT_CAMERA(tau, S), ...shake(tau, S.beats(1) - .2, 9, .7)}), holds: {0: .8, 1: 1.6}, set(c, tau, S) {
    const L = L_(S), fire = span(L(1) - .3, L(1) + .8, tau);
    if (fire > 0) { resetT(c); c.save(); c.globalAlpha = fire; blitS(c, washLayer('fire', 2)); c.restore(); }
    c.save(); c.fillStyle = '#f6efd8'; for (let k = 0; k < 40; k++) { c.globalAlpha = .6 * (1 - fire); c.beginPath(); c.arc(200 + hash(k, 1) * 1500, 80 + hash(k, 2) * 380, 2.4, 0, TAU); c.fill(); } c.restore();
    sh(c, circ(1500, 170, 46, 24), '#f6efd8', {w: LINE, al: 1 - fire * .6});
    for (let k = 0; k < 8; k++) stiltHouse(c, 300 + k * 190, 770, .7, {col: '#5d4b6e', roof: '#3b2f4c'});
    budTower(c, 1000, 770, 110, 280, '#5d5470'); budTower(c, 1180, 770, 80, 200, '#5d5470');
    if (fire > 0) for (let k = 0; k < 7; k++) { const p = span(L(1) - .2 + k * .18, L(1) + .5 + k * .18, tau); if (p > 0) fireT(c, 330 + k * 210, 700, .9 * p, tau + k, k); }
    waveRoller(c, 760, tau, {col: '#3d5c86', dk: '#223a5e', h: 120, ph: .5});
    const bx = lerp(-500, 1100, span(L(0) - .6, L(1) + 1, tau, easeInOutSine));
    boatT(c, bx, 860, .72, tau, {side: 'cham'});
    boatT(c, bx - 560, 890, .62, tau + .5, {side: 'cham'});
    waveRoller(c, 860, tau, {col: '#35507a', dk: '#1d3050', h: 200, ph: 2.1});
    if (tau > L(1) + .4) for (let k = 0; k < 3; k++) { const x = 1300 + (tau - L(1) - .4) * 180 + k * 90; pp(c, x, 900, .75, {body: [T.orange, T.teal, T.pink][k], hat: k === 1 ? 'bun' : 'hair', skirt: k === 1, mood: 'shock', arms: 'up', walk: tau * 1.6 + k * .3, t: tau}); }
    signBoard(c, 960, 60, 360, 84, '1177', {size: 56, fill: '#5d2a3a', drop: span(.3, 1, tau)});
    if (tau > L(1) + .4) for (let k = 0; k < 3; k++) emote(c, tau, L(1) + .5 + k * .15, 1300 + (tau - L(1) - .4) * 180 + k * 90, 610, '!', {t1: L(1) + 6});
  }},
  {name: 'jaya', mood: 'gold', camera: (tau, S) => ({...DEFAULT_CAMERA(tau, S), ...shake(tau, S.beats(0) + 2, 16, .6)}), holds: {0: 1.6, 1: .8, 2: .8}, set(c, tau, S) {
    const L = L_(S), battle = 1 - span(L(1) - .6, L(1), tau);
    if (battle > 0) { c.save(); c.globalAlpha = battle;
      waveRoller(c, 740, tau, {h: 120});
      const kx = lerp(-300, 720, span(L(0) - .6, L(0) + 2, tau, easeOut)), hit = span(L(0) + 2, L(0) + 3, tau);
      c.save(); c.translate(1300, 820 + hit * 120); c.rotate(hit * .5); boatT(c, 0, 0, .66, tau, {side: 'cham', dir: -1}); c.restore();
      boatT(c, kx, 820, .7, tau, {side: 'khmer'});
      if (hit > .5) crocT(c, 1500, 900, .9, tau);
      waveRoller(c, 840, tau, {h: 220, ph: 2, col: '#86c3d3'});
      c.restore(); }
    const by = span(L(1) - .2, L(1) + 1.2, tau);
    rise(c, by, g => { bayonT(g, 720, 770, .9); bayonT(g, 1280, 770, .9); bayonT(g, 1000, 770, 1.25); });
    signBoard(c, 560, 90, 440, 96, 'មន្ទីរពេទ្យ ១០២', {font: FONT.khmer, size: 44, fill: T.red, drop: span(L(2) + .6, L(2) + 1.2, tau)});
    signBoard(c, 1440, 90, 440, 96, 'ផ្ទះសំណាក់ ១២១', {font: FONT.khmer, size: 44, fill: T.teal, drop: span(L(2) + 1.8, L(2) + 2.4, tau)});
    if (tau > L(1) + 1) pp(c, 1000, 900, 1.1, {body: T.red, hat: 'mokot', arms: tau > L(3) ? 'up' : 'point', mood: tau > L(3) ? 'star' : 'happy', t: tau});
    if (tau > L(2) + .4) for (let k = 0; k < 2; k++) pp(c, 1380 + k * 130, 890, .85, {body: [T.white, T.orange][k], hat: k ? 'hair' : 'bun', mood: 'happy', arms: 'pray', dir: -1, t: tau});
    confetti(c, 1000, 400, tau, L(3) + .3, {n: 80});
    impact(c, tau, L(0) + 2, 1150, 720, {r: 110}); dust(c, tau, L(0) + 2.1, 1250, 860, {n: 6, s: 1.3});
  }},
  {name: 'zhou', mood: 'warm', holds: {1: 1}, set(c, tau, S) {
    const L = L_(S);
    bayonT(c, 1160, 760, .62, {col: T.gold});
    palmT(c, 1560, 770, 330); palmT(c, 700, 770, 280, {lean: -20});
    pp(c, 560, 880, 1.05, {body: T.teal, hat: 'futou', robe: true, arms: 'hold', dir: 1, t: tau, prop: {draw: PROPS.scroll}});
    signBoard(c, 560, 60, 380, 80, 'Zhou Daguan', {size: 38, drop: span(L(0) + .6, L(0) + 1.3, tau)});
    const ex = lerp(2200, 1180, span(L(1) - 1.2, L(1) + 2.6, tau, easeInOutSine)), walking = tau < L(1) + 2.6;
    for (let k = 0; k < 3; k++) pp(c, ex + 220 + k * 110, 880, .85, {body: T.navy, arms: 'hold', dir: -1, walk: walking ? tau * 1.4 + k * .3 : null, t: tau, prop: {draw: PROPS.parasol}});
    elephantT(c, ex, 890, .62, walking ? tau * .9 : 0, {gold: true, walk: walking, rider: g => pp(g, 0, 0, 1, {body: T.red, hat: 'mokot', arms: 'point', mood: 'happy'})});
    const mk2 = span(L(2) - .2, L(2) + .6, tau);
    if (mk2 > 0) { c.save(); c.globalAlpha = mk2; for (let k = 0; k < 3; k++) { const x = 820 + k * 150; sh(c, rr(x - 60, 890, 120, 20, 6), '#d9b26a', {w: 4}); pp(c, x, 880, .78, {body: [T.pink, T.green, T.orange][k], hat: 'bun', skirt: true, arms: 'hold', mood: 'happy', dir: k % 2 ? -1 : 1, t: tau}); for (let j = 0; j < 3; j++) sh(c, circ(x - 30 + j * 30, 880, 12, 12), [T.yellow, T.red, T.green][j], {w: 3.4}); } c.restore(); }
    emote(c, tau, L(1) + 1.8, 560, 610, '!', {t1: L(1) + 3.4}); bubble(c, tau, L(2) + .3, L(2) + 3, 700, 520, 'Amazing!', {w: 240, h: 90, size: 34, tail: [-90, 80]});
  }},
  {name: 'faith', mood: 'saffron', holds: {0: .8, 1: 1.2}, set(c, tau, S) {
    const L = L_(S);
    angkorFlat(c, 1000, 760, .5);
    buddhaT(c, 1600, 860, .75);
    for (let k = 0; k < 5; k++) { const x = lerp(1900, 820, span(0, L(1) + 3, tau)) + k * 120; pp(c, x, 890, .82, {body: T.saffron, hat: 'bald', robe: true, arms: 'hold', dir: -1, walk: tau * 1.2 + k * .3, t: tau, mood: 'happy', prop: {draw: PROPS.bowl}}); }
    for (let k = 0; k < 2; k++) pp(c, 620 + k * 110, 880, .82, {body: [T.red, T.teal][k], hat: k ? 'bun' : 'hair', skirt: k === 1, arms: 'pray', t: tau});
    for (let k = 0; k < 2; k++) emote(c, tau, L(1) - .8 + k * .3, 620 + k * 110, 610, 'heart', {t1: L(1) + 2.5});
  }},
  {name: 'drought', mood: 'dust', holds: {1: .8, 2: 2}, set(c, tau, S) {
    const L = L_(S), storm = span(L(2) - .4, L(2) + .6, tau);
    if (storm > 0) { resetT(c); c.save(); c.globalAlpha = storm; blitS(c, washLayer('storm', 4)); c.restore(); }
    if (storm < 1) sunBurst(c, 1350, 230, 70 + 30 * span(L(0), L(1) + 2, tau), tau, {col: T.orange});
    const lvl = 1 - span(L(1) - .3, L(1) + 3, tau) * .85 + storm * .6;
    sh(c, ell(1000, 830, 420, 62, 30), '#c9a66a', {w: LINE});
    if (lvl > .1) sh(c, ell(1000, 830, 400 * lvl, 54 * lvl, 30), T.water, {w: 4});
    if (lvl < .6) for (let k = 0; k < 8; k++) mk(c, [[700 + k * 80, 810 + (k % 2) * 30], [720 + k * 80, 830], [700 + k * 80, 850 - (k % 3) * 10]], {w: 3, al: .7});
    signBoard(c, 1000, 80, 360, 80, 'Baray', {size: 40, drop: span(.3, 1, tau)});
    for (let k = 0; k < 2; k++) pp(c, [560, 1500][k], 890, .85, {body: [T.orange, T.teal][k], hat: k ? 'bun' : 'hair', skirt: k === 1, mood: storm > .5 ? 'shock' : tau > L(1) ? 'sad' : 'neutral', arms: storm > .5 ? 'up' : 'down', dir: k ? -1 : 1, t: tau});
    if (storm > 0) { for (const [x, y] of [[700, 200], [1150, 170], [1500, 220]]) onStick(c, x, y, g => { cloudT(g, 0, 0, 1.3, {col: '#8d9aa6'}); for (let k = 0; k < 10; k++) { const yy = 34 + ((tau * 360 + k * 41) % 150); mk(g, [[-72 + k * 16, yy], [-80 + k * 16, yy + 28]], {w: 3.4, color: '#3d5f7a'}); } }, storm);
      if ((tau * 2.3) % 1 < .07 && storm > .9) { resetT(c); c.save(); c.globalAlpha = .35; c.fillStyle = '#fff'; c.fillRect(0, 0, W, H); c.restore(); }
      waveRoller(c, lerp(1000, 800, span(L(2), L(2) + 2.5, tau)), tau, {col: '#a8845a', dk: '#7d5b3a', h: 280, amp: 50}); }
    if (storm > .3) rain(c, tau, {n: 160, al: .5 * storm});
    for (let k = 0; k < 2; k++) { emote(c, tau, L(1) + .6 + k * .3, [560, 1500][k], 610, 'sweat', {t1: L(2) - .5}); emote(c, tau, L(2) + .4 + k * .2, [560, 1500][k], 610, '!', {t1: L(2) + 2.4}); }
  }},
  {name: 'ayutthaya', mood: 'dust', holds: {1: .8, 2: 1.2}, set(c, tau, S) {
    const L = L_(S);
    hangingMap(c, 1010, 70, 1080, 600, span(L(0) - .6, L(0) + .4, tau), (g, w, h) => {
      g.fillStyle = '#a9d3e0'; g.fillRect(0, 0, w, h);
      sh(g, [[-20, -20], [w + 20, -20], [w + 20, 380], [860, 470], [700, 560], [560, 520], [420, 440], [260, 420], [120, 470], [-20, 430]], '#e6d7a4', {w: 4.4});
      sh(g, ell(640, 250, 90, 36, 20), T.water, {w: 3.6});
      mk(g, [[900, -10], [880, 200], [820, 380], [760, 520]], {w: 9}); mk(g, [[900, -10], [880, 200], [820, 380], [760, 520]], {w: 5, color: T.water});
      mk(g, [[700, 290], [760, 400]], {w: 8}); mk(g, [[700, 290], [760, 400]], {w: 4, color: T.water});
      const city = (x, y, p, name, col) => { if (p <= 0) return; g.save(); g.translate(x, y); g.scale(pop(p, 0, 1), pop(p, 0, 1)); budTower(g, 0, 0, 30, 60, col); g.restore(); g.font = `600 26px ${FONT.serif}`; g.fillStyle = T.ol; g.textAlign = 'center'; g.globalAlpha = clamp(p, 0, 1); g.fillText(name, x, y + 34); g.globalAlpha = 1; };
      city(170, 260, span(L(0), L(0) + .8, tau), 'Ayutthaya', '#e8c0a0'); city(600, 180, 1, 'Angkor', T.stone);
      const ar = span(L(1) - .3, L(1) + 1.6, tau); if (ar > 0) { const q = cutAt(smoothLine([[200, 250], [350, 210], [500, 190], [585, 180]], 4), ar); mk(g, q, {w: 12, color: T.red, raw: true}); if (ar >= 1) fireT(g, 610, 170, .35, tau, 1); }
      const bp = span(L(2), L(2) + 3, tau, easeInOutSine); if (bp > 0) { const q = cutAt(smoothLine([[600, 200], [650, 260], [720, 320], [760, 420], [770, 480]], 4), bp); for (let k = 0; k < q.length; k += 6) { g.fillStyle = T.goldDk; g.beginPath(); g.arc(q[k][0], q[k][1], 4, 0, TAU); g.fill(); } const e = q[q.length - 1]; g.save(); g.translate(e[0], e[1]); g.scale(.12, .12); boatT(g, 0, 0, 1, tau, {side: 'khmer', rowers: 3, crew: 0}); g.restore(); }
      city(770, 500, span(L(2) + 2.6, L(2) + 3.4, tau), 'Chaktomuk · Phnom Penh', '#f0c89a');
    });
    for (let k = 0; k < 4; k++) { const p = span(L(1) - .3, L(1) + .3, tau); if (p <= 0) continue; const x = lerp(-200, 900, span(L(1), L(2) + 2, tau)) - k * 110; pp(c, x, 890, .82, {body: T.teal, hat: 'helmet', arms: 'hold', mood: 'neutral', walk: tau * 1.3 + k * .25, t: tau, prop: {draw: PROPS.spear}}); }
  }},
  {name: 'forest', mood: 'forest', holds: {0: 1, 2: 1.2}, set(c, tau, S) {
    const L = L_(S), g = span(L(0) - .6, L(1) + 1, tau);
    for (const [x, h] of [[520, 340], [1540, 380], [1680, 280]]) { const k = .35 + .65 * g; c.save(); c.translate(x, 770); c.scale(k, k); treeT(c, 0, 0, h, {col: T.greenDk}); c.restore(); }
    gateT(c, 1030, 770, .95, g, tau);
    const yr = Math.round(keys(tau, [[L(0), 1431, t => t], [L(2) + 1, 1860]]));
    signBoard(c, 1030, 60, 300, 80, String(yr), {size: 52, drop: span(.3, 1, tau)});
    if (tau > L(2) - .3) { const p = pop(tau, L(2) - .3); c.save(); c.globalAlpha = clamp(p, 0, 1); pp(c, 1030, 900, .95, {body: T.saffron, hat: 'bald', robe: true, arms: 'pray', mood: 'happy', t: tau}); pp(c, 1200, 900, .85, {body: T.saffron, hat: 'bald', robe: true, arms: 'pray', mood: 'happy', dir: -1, t: tau + 1}); c.restore(); }
  }},
  {name: 'today', mood: 'dawn', post: 3, holds: {1: 1.5, 2: 1}, set(c, tau, S) {
    const L = L_(S);
    sunBurst(c, 1060, lerp(640, 300, span(0, L(1), tau, easeOut)), 90, tau);
    angkorFlat(c, 1060, 770, .72);
    flagT(c, 1420, 770, 220, tau, span(L(0) - .2, L(0) + 2.4, tau));
    const cast = [[640, {body: T.red, hat: 'mokot'}], [760, {body: T.saffron, hat: 'bald', robe: true}], [880, {body: T.teal, hat: 'bun', skirt: true}], [1240, {body: T.navy, hat: 'band'}], [1370, {body: T.orange, hat: 'hair'}], [1480, {body: T.pink, hat: 'tiara', skirt: true}]];
    cast.forEach(([x, o], k) => { const p = pop(tau, L(1) + k * .18); if (p > 0) { c.save(); c.translate(x, 900); c.scale(p, p); pp(c, 0, 0, .9, {...o, arms: 'cheer', mood: k % 3 ? 'happy' : 'star', t: tau + k}); c.restore(); } });
    confetti(c, 1060, 300, tau, L(2) + .3, {n: 90}); confetti(c, 700, 300, tau, L(2) + 1.2, {n: 50, seed: 7}); confetti(c, 1400, 300, tau, L(2) + 1.6, {n: 50, seed: 11});
    for (let k = 0; k < 3; k++) emote(c, tau, L(2) + .5 + k * .25, [760, 1240, 1480][k], 620, 'heart', {t1: L(2) + 4});
  }},
];
function mapLabelT(c, text, x, y, a) { if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `600 34px ${FONT.serif}`; c.textAlign = 'center'; c.fillStyle = T.ol; c.fillText(text, x, y); c.restore(); }
