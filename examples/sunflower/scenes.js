'use strict';
// The Life of a Sunflower: ten wordless scenes in the pencil style (captions + music,
// no voice). Each scene lasts `dur` seconds; action is timed in scene seconds (tau).
// Stage: 1920 x 1080, grass line at SOIL_Y = 760, a cut-away garden bed below it.

const FIXED = (x = 960, y = 540, zoom = 1) => () => ({x, y, zoom});
const GS = 1.1;   // gardener scale (~ 240 units tall)
function gardener(c, x, tau, o = {}) { pp(c, x, SOIL_Y, GS, {body: T.blue, hat: 'sunhat', robe: true, t: tau, ...o}); }
const GHEAD = 470;   // emote height over the gardener
const cap = (t0, t1, text) => ({t0, t1, text});
// A keyframed flight path; returns {p, dir, moving}. frames: [[t, [x, y]], ...]
function flight(tau, frames, wig = 14) {
  const pos = t => keys(t, frames, easeInOutSine), a = pos(tau - .05), b = pos(tau + .05), v = sub(b, a), moving = len(v) > .5;
  const p = pos(tau); if (moving) p[1] += Math.sin(tau * 8.5) * wig;
  return {p, dir: v[0] < -.3 ? -1 : 1, moving};
}
function trail(c, tau, frames, {n = 7, col = INK, pollen = 0} = {}) {
  for (let k = 1; k <= n; k++) { const t = tau - k * .09, f = flight(t, frames); if (!f.moving) continue; c.save(); c.globalAlpha *= (1 - k / (n + 1)) * .7; c.fillStyle = pollen > 0 && k % 2 ? COL.pollen : col; c.beginPath(); c.arc(f.p[0], f.p[1] + 14, pollen > 0 && k % 2 ? 4 : 2.6, 0, TAU); c.fill(); c.restore(); }
}
function puff(c, tau, t0, x, y, {n = 14, col = COL.pollen, d = 1} = {}) {
  const u = (tau - t0) / d; if (u < 0 || u > 1) return;
  c.save(); c.globalAlpha *= 1 - u; c.fillStyle = col;
  for (let k = 0; k < n; k++) { const a = k / n * TAU + hash(k, 3), r = 20 + u * (40 + hash(k, 4) * 50); c.beginPath(); c.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * .8, 3.4, 0, TAU); c.fill(); }
  c.restore();
}
function sunFace(c, x, y, r, tau, o = {}) { sunBurst(c, x, y, r, tau); c.save(); c.translate(x, y); face(c, r * .78, {mood: 'happy', ...o}); c.restore(); }
function moonT(c, x, y, r) { sh(c, [...ell(x, y, r, r, 24, -2.2, 2.2), ...ell(x + r * .45, y, r * .78, r * .82, 18, 1.9, -1.9)], '#f3edd2', {w: 4}); }

const SCENES = [
  // 1. Title: the page, a sunflower or two, the title written on, a seed drops in.
  {name: 'title', mood: 'warm', dur: 6, camera: FIXED(), set(c, tau) {
    sunFace(c, 1600, 170, 56, tau);
    plantT(c, 210, SOIL_Y, {h: 470, leaves: 8, head: 1, bloom: 1, yaw: .3, R: 50, t: tau});
    plantT(c, 1720, SOIL_Y, {h: 300, leaves: 5, head: 1, bloom: 1, yaw: -.35, R: 38, t: tau + 2});
    handText(c, 'The Life of a Sunflower', 960, 330, 100, span(.4, 2.4, tau, linear));
    const ul = cutAt(smoothLine([[520, 368], [800, 360], [1110, 368], [1400, 358]], 4), span(2.3, 2.9, tau)); if (ul.length > 1) mk(c, ul, {w: 6, raw: true, color: T.goldDk});
    handText(c, 'from seed to seed', 960, 450, 52, span(2.7, 3.7, tau, linear), {col: '#5a5650'});
    if (tau > 3.8) { const fall = tau < 4.5, p = fall ? [960, lerp(-60, 746, easeIn(span(3.8, 4.5, tau, linear)))] : hop(tau, 4.5, 5.0, [960, 746], [1010, 746], 46);
      seedT(c, p[0], p[1], 1, fall ? (tau - 3.8) * 5 : lerp(3.5, Math.PI / 2 + TAU * 0, span(4.5, 5.0, tau)), {face: tau > 5.1 ? 'happy' : null}); }
    dust(c, tau, 4.5, 960, SOIL_Y, {n: 5, s: .8});
  }},

  // 2. Planting: the gardener arrives, has an idea, drops the seed in a hole, covers and waters it.
  {name: 'plant', mood: 'warm', dur: 11, captions: [cap(.5, 5.2, 'Every sunflower begins as a tiny seed.'), cap(5.6, 10.6, 'In spring, it is planted in warm, soft soil.')], set(c, tau) {
    const walking = tau < 2.6, gx = travel(tau, .2, 2.6, [-170, SOIL_Y], [800, SOIL_Y], easeOut)[0];
    const dig = pop(tau, 3.3, .4) * (1 - span(6.0, 6.8, tau)), mound = span(6.0, 6.8, tau);
    if (dig > 0) sh(c, [[915, SOIL_Y - 2, 1], [932, SOIL_Y + 30 * dig], [960, SOIL_Y + 44 * dig], [988, SOIL_Y + 30 * dig], [1005, SOIL_Y - 2, 1]], '#6e5a44', {w: 3.6});
    if (mound > 0) sh(c, [[895, SOIL_Y + 3, 1], [928, SOIL_Y - 12 * mound], [960, SOIL_Y - 19 * mound], [992, SOIL_Y - 12 * mound], [1025, SOIL_Y + 3, 1]], '#a88d6c', {w: 3.6});
    dust(c, tau, 3.3, 960, SOIL_Y, {n: 5, s: .8});
    const tilt = keys(tau, [[7.0, 0], [7.6, 1.0], [9.8, 1.0], [10.3, 0]]), pouring = tau > 7 && tau < 10.4;
    const arms = walking ? 'down' : tau > 3.0 && tau < 5.6 ? 'point' : pouring ? 'hold' : 'down';
    gardener(c, gx, tau, {walk: walking ? stepPhase(gx) : null, arms, prop: pouring ? canProp(tilt) : null, look: tau > 3 ? 1 : 0});
    // The seed: in the hand, dropped into the hole, then asleep in the soil.
    const hand = [800 + 62 * GS * PPK, SOIL_Y - 104 * GS * PPK];
    if (tau > 3.0 && tau < 4.6) seedT(c, hand[0] + 6, hand[1] + 14, .8, .4);
    else if (tau >= 4.6) { const p = hop(tau, 4.6, 5.3, [hand[0] + 6, hand[1] + 14], [960, 800], 70); seedT(c, p[0], p[1], tau < 5.3 ? .8 + .2 * span(4.6, 5.3, tau) : 1, lerp(.4, 0, span(4.6, 5.3, tau)), {face: tau > 7.4 ? 'sleep' : null}); }
    waterDrops(c, tau, 7.6, 9.8, spoutAt(800, SOIL_Y, GS, tilt), [965, SOIL_Y - 14]);
    seep(c, tau, 8.2, 10.8, 960, 768, 786);
    bubble(c, tau, 2.7, 4.4, 1080, 330, (g) => { seedT(g, -80, 0, .8, 0); arrowT(g, [-45, 0], [10, 0], 1, {bow: 0, w: 3.6}); headT(g, 70, 0, 1, {R: 26, bloom: 1}); }, {w: 300, h: 150, think: true, tail: [-160, 110]});
    emote(c, tau, 2.6, gx + 10, GHEAD, 'idea', {t1: 4.2});
    emote(c, tau, 7.9, 985, 770, 'zzz', {s: .6, t1: 11});
    emote(c, tau, 9.3, gx, GHEAD, 'heart', {t1: 10.8});
  }},

  // 3. Underground: water soaks in, the seed wakes, splits, sends a root down and a shoot up.
  {name: 'sprout', mood: 'warm', dur: 13, captions: [cap(.6, 5.6, 'Water soaks in. The seed wakes up and splits open.'), cap(6.0, 12.4, 'A root grows down first, then a shoot pushes up.')],
    camera: tau => { const u = span(.2, 2.2, tau); return {x: 960, y: lerp(540, 800, u), zoom: lerp(1, 2.4, u)}; },
    set(c, tau) {
      seep(c, tau, .4, 3.2, 960, 768, 792, {n: 12});
      const swell = 1 + .3 * easeOutBack(span(2.6, 3.4, tau, linear)), jig = tau > 2.6 && tau < 3.4 ? Math.sin(tau * 45) * 1.6 : 0, split = span(4.0, 4.8, tau);
      rootT(c, 960, 836, span(4.6, 9.0, tau, easeOut), {len: 120});
      if (tau < 7.6) seedT(c, 960 + jig, 800, swell, 0, {split, face: tau < 2.8 ? 'sleep' : 'awake'});
      else shootT(c, [960, 836], lerp(800, 792, span(7.6, 12.4, tau)) - 10 * span(8.5, 12.4, tau), span(7.6, 9.0, tau), {seedS: 1.3});
      emote(c, tau, .6, 990, 772, 'zzz', {s: .5, t1: 2.7});
      emote(c, tau, 3.0, 964, 752, '!', {s: .4, t1: 4.0});
      const day = 1 + Math.floor(span(.5, 12.4, tau, linear) * 9);
      c.save(); resetT(c); const a = span(1.2, 1.8, tau); mk(c, rr(92, 52, 212, 94, 14), {w: 4, close: true, al: a}); handText(c, `Day ${day}`, 198, 118, 54, a > 0 ? 1 : 0, {al: a}); c.restore();
    }},

  // 4. Seedling: the hook breaks the soil, straightens, drops its seed coat, opens its seed leaves.
  {name: 'seedling', mood: 'dawn', dur: 11, captions: [cap(.6, 4.6, 'The sprout breaks through the soil into the light.'), cap(5.0, 10.4, 'Two seed leaves open, then the first true leaves grow.')],
    camera: tau => { const u = span(4.0, 7.5, tau); return {x: 960, y: lerp(700, 560, u), zoom: lerp(2.1, 1.2, u)}; },
    set(c, tau) {
      sunFace(c, 1480, lerp(520, 250, span(0, 7, tau, easeOut)), 58, tau);
      rootT(c, 960, 836, 1, {len: lerp(120, 175, span(3, 10, tau))});
      if (tau < 3.0) { const hook = 1 - span(1.8, 3.0, tau), tipY = lerp(782, 735, span(.3, 1.8, tau)) - 35 * span(1.8, 3.0, tau); shootT(c, [960, 836], tipY, hook, {seedS: 1.3}); }
      else {
        sh(c, strip([[960, 836], [960, 760]], profile([[0, 11], [1, 10]]), false), '#cfe0a0', {w: 3.4});
        const h = lerp(65, 160, span(4.5, 10.2, tau)), leaves = 2 * span(5.2, 7.6, tau) + span(8.0, 10.2, tau);
        plantT(c, 960, SOIL_Y, {h, cot: span(3.0, 4.0, tau), leaves, t: tau, stemCol: '#a9cf7c'});
        const coat = hop(tau, 3.0, 3.8, [960, 700], [1070, 752], 60); seedT(c, coat[0], coat[1], 1.3, tau < 3.8 ? (tau - 3) * 5 : 4, {split: 1, kernel: false});
      }
      dust(c, tau, 1.0, 968, SOIL_Y, {n: 6, s: .8});
      for (const [x, a] of [[940, -.5], [990, .5]]) mk(c, [[x, SOIL_Y + 2], [x + Math.sin(a) * 18, SOIL_Y + 14]], {w: 3, al: span(.9, 1.2, tau)});
      const gx = travel(tau, 5.0, 7.0, [2100, SOIL_Y], [1340, SOIL_Y], easeOut)[0], walking = tau > 5 && tau < 7;
      if (tau > 5) gardener(c, gx, tau, {dir: -1, walk: walking ? stepPhase(gx) : null, arms: tau > 8.2 ? 'cheer' : 'down', mood: tau > 8.2 ? 'star' : 'happy'});
      emote(c, tau, 7.4, 1340, GHEAD, 'heart', {t1: 9.2});
    }},

  // 5. Growing: rain, then sun; the plant shoots up past the gardener to the 3 m mark.
  {name: 'grow', mood: 'green', dur: 12, captions: [cap(.6, 5.4, 'Rain, sunshine and soil feed the growing plant.'), cap(5.8, 11.4, 'It grows fast, and can reach 3 meters tall!')], set(c, tau) {
    const g = span(1.0, 10.5, tau, easeInOutSine), h = lerp(160, 540, g);
    const sunP = pop(tau, 4.4, .6); if (sunP > 0) { c.save(); c.translate(1580, 160); c.scale(sunP, sunP); sunFace(c, 0, 0, 58, tau); c.restore(); }
    const ruler = span(5.0, 6.2, tau, linear);
    if (ruler > 0) { c.save(); c.beginPath(); c.rect(600, SOIL_Y - 560 * ruler - 10, 200, 560 * ruler + 12); c.clip();
      sh(c, rr(688, SOIL_Y - 556, 22, 556, 4), T.stone, {w: 4});
      for (let m = 1; m <= 3; m++) { const y = SOIL_Y - m * 180; mk(c, [[680, y], [716, y]], {w: 4}); handText(c, `${m} m`, 668, y + 11, 34, 1, {align: 'right'}); }
      for (let k = 1; k < 12; k++) if (k % 4) mk(c, [[690, SOIL_Y - k * 45], [704, SOIL_Y - k * 45]], {w: 2.4}); c.restore(); }
    const top = plantT(c, 900, SOIL_Y, {h, leaves: lerp(3, 9, g), cot: 1, cotAge: span(2, 8, tau), t: tau});
    if (tau > 5 && tau < 10.3) for (let k = -1; k <= 1; k++) { const ph = ((tau * 1.6 + k * .33) % 1); mk(c, [[top[0] + k * 26, top[1] - 20 - ph * 40], [top[0] + k * 26, top[1] - 44 - ph * 40]], {w: 3, al: Math.sin(ph * Math.PI) * .8}); }
    const raining = tau < 4.6, gx = 1320;
    gardener(c, gx, tau, {dir: -1, arms: raining ? 'hold' : tau > 10 ? 'up' : 'down', mood: tau > 10 ? 'star' : 'happy', prop: raining ? UMBRELLA : null});
    const cx = lerp(900, 2400, span(4.2, 6.2, tau, easeIn)); if (cx < 2300) rainCloud(c, cx, 150, 2.4);
    rain(c, tau, {n: 80, al: .6 * span(.3, .9, tau) * (1 - span(3.8, 4.6, tau)), slant: .06, col: '#6f95b8', len: 46, speed: 1100});
    emote(c, tau, 9.3, gx, GHEAD, '!', {t1: 11});
  }},

  // 6. The bud: it forms, follows the sun from east to west, and turns back east at night.
  {name: 'bud', mood: 'warm', dur: 13, camera: FIXED(), captions: [cap(.6, 4.4, 'A green bud forms at the top of the stem.'), cap(5.0, 9.2, 'All day, the young bud follows the sun from east to west.'), cap(9.6, 12.6, 'At night, it turns back to face the east.')], set(c, tau) {
    const u = span(3.6, 9.2, tau, easeInOutSine), arc = v => [lerp(170, 1750, v), 560 - 420 * Math.sin(Math.PI * v)];
    for (let k = 0; k < 40; k++) { const v0 = k / 40; if (v0 > u - .02 || k % 2) continue; mk(c, [arc(v0), arc(v0 + 1 / 45)], {w: 3, al: .45}); }
    const sp = tau < 3.6 ? [170, lerp(660, 560, span(0, 3.6, tau))] : tau < 9.2 ? arc(u) : [1750, lerp(560, 760, span(9.2, 10.2, tau))];
    sunFace(c, sp[0], sp[1], 56, tau);
    handText(c, 'EAST', 170, 720, 40, span(3.4, 4.2, tau, linear)); handText(c, 'WEST', 1750, 720, 40, span(8.8, 9.6, tau, linear));
    const yaw = tau < 3.6 ? -.85 : tau < 9.8 ? lerp(-.85, .85, u) : lerp(.85, -.85, span(10, 12, tau));
    plantT(c, 840, SOIL_Y, {h: 540, leaves: 9, head: span(.5, 3.0, tau, easeOut), R: 40, yaw, lean: 90 * yaw, t: tau});
    const night = span(9.4, 10.4, tau) * (1 - span(12.4, 13, tau));
    if (night > 0) { c.save(); resetT(c); c.globalAlpha = night * .5; c.fillStyle = hatchPattern(c, '#3f4a78', {dens: 1.8, len: 34}); c.fillRect(0, 0, W, H); c.globalAlpha = night * .22; c.fillStyle = '#2d3558'; c.fillRect(0, 0, W, H); c.restore();
      c.save(); c.globalAlpha = night; moonT(c, 1480, 160, 44); for (let k = 0; k < 14; k++) sparkle(c, 120 + hash(k, 1) * 1680, 60 + hash(k, 2) * 360, .5, night * .8); c.restore(); }
  }},

  // 7. Blooming: close up, the bracts open, petals unfurl, florets fill the face.
  {name: 'bloom', mood: 'gold', dur: 13, captions: [cap(.6, 6.2, 'The bud opens into a big, bright yellow flower.'), cap(6.6, 12.4, 'Its face is made of hundreds of tiny florets.')],
    camera: tau => { const u = span(0, 2.2, tau); return {x: lerp(960, 840, u), y: lerp(540, 250, u), zoom: lerp(1, 2.3, u)}; },
    set(c, tau) {
      const R = lerp(40, 54, span(1.5, 6.5, tau)), yaw = lerp(-.6, 0, span(0, 2, tau));
      plantT(c, 840, SOIL_Y, {h: 540, leaves: 9, head: 1, R, yaw, t: tau * .3, bloom: span(2.0, 6.0, tau, linear), florets: span(6.2, 9.4, tau, linear),
        petalGrow: id => span(2.0 + hash(id, 3) * 2.2, 3.4 + hash(id, 3) * 2.2, tau, linear)});
      const sa = span(6.0, 6.3, tau) * (1 - span(7.2, 7.7, tau));
      for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + .3, r = 150 + 10 * Math.sin(tau * 4 + k); sparkle(c, 840 + Math.cos(a) * r, 204 + Math.sin(a) * r * .9, .8, sa); }
      handText(c, 'petals', 1090, 104, 30, span(7.0, 7.6, tau, linear)); arrowT(c, [1040, 108], [938, 132], span(7.2, 7.9, tau));
      handText(c, 'florets', 640, 360, 30, span(8.4, 9.0, tau, linear)); arrowT(c, [690, 338], [812, 236], span(8.6, 9.3, tau), {bow: -.18});
    }},

  // 8. Bees: nectar, pollen dust on their legs, pollen carried from one flower to the other.
  {name: 'bees', mood: 'gold', dur: 11, camera: FIXED(1100, 400, 1.25), captions: [cap(.6, 5.2, 'Bees visit the flowers to drink sweet nectar.'), cap(5.6, 10.6, 'They carry pollen from flower to flower.')], set(c, tau) {
    const h1 = headPos(840, SOIL_Y, 540, 0, 54, -.1), h2 = headPos(1430, SOIL_Y, 430, 0, 46, .15);
    plantT(c, 1430, SOIL_Y, {h: 430, leaves: 7, head: 1, bloom: 1, R: 46, yaw: .15, t: tau + 1, pollen: span(7.4, 8.0, tau)});
    plantT(c, 840, SOIL_Y, {h: 540, leaves: 9, head: 1, bloom: 1, R: 54, yaw: -.1, t: tau, pollen: .5 + .5 * span(9.0, 9.6, tau)});
    const B1 = [[.4, [250, 110]], [2.6, add(h1, [12, -14])], [4.8, add(h1, [12, -14])], [7.2, add(h2, [0, -14])], [9.0, add(h2, [0, -14])], [11, [1950, -120]]];
    const B2 = [[2.0, [1980, 90]], [4.2, add(h2, [-14, -6])], [6.4, add(h2, [-14, -6])], [8.8, add(h1, [-20, 8])], [11, add(h1, [-20, 8])]];
    const p1 = span(3.2, 3.8, tau) * (1 - span(7.4, 8.2, tau) * .7), p2 = span(5.0, 5.6, tau) * (1 - span(9.0, 9.8, tau) * .7);
    trail(c, tau, B1, {pollen: p1}); trail(c, tau, B2, {pollen: p2});
    for (const [F, pol, k] of [[B1, p1, 0], [B2, p2, 1]]) { const f = flight(tau, F); beeT(c, f.p[0], f.p[1] + (f.moving ? 0 : Math.sin(tau * 5 + k) * 3), 1.1, tau + k * .5, {dir: f.dir, pollen: pol}); }
    puff(c, tau, 7.4, h2[0], h2[1]); puff(c, tau, 9.0, h1[0] - 20, h1[1] + 8);
    emote(c, tau, 3.0, h1[0] + 12, h1[1] - 70, 'heart', {s: .6, t1: 4.6});
    emote(c, tau, 4.6, h2[0] - 14, h2[1] - 62, 'heart', {s: .6, t1: 6.2});
  }},

  // 9. Seeds: petals dry and drop, the head bows, florets turn to seeds, a finch helps itself.
  {name: 'seeds', mood: 'dust', dur: 11, captions: [cap(.6, 5.2, 'Petals dry and fall. The heavy head bows down.'), cap(5.6, 10.6, 'Each tiny floret has become a new seed.')], set(c, tau) {
    const wilt = span(.3, 3.5, tau), fallen = clamp((tau - .8) / 2.8, 0, 1), hc = headPos(840, SOIL_Y, 540, 0, 54, -.4);
    for (let id = 0; id < 42; id++) { const tf = .8 + hash(id, 7) * 2.8; if (tau < tf) continue;
      const k = id % 21, a = (k + (id >= 21 ? .5 : 0)) / 21 * TAU + .1, u = clamp((tau - tf) / 2.2, 0, 1), s0 = add(hc, [Math.cos(a) * 80 * .8, Math.sin(a) * 80]);
      const x = s0[0] + Math.sin(u * 6 + id) * 30 * (1 - u) + (hash(id, 2) - .5) * 160 * u, y = lerp(s0[1], 752 + hash(id, 9) * 6, easeIn(u));
      petalT(c, x, y, a + u * (3 + hash(id, 4) * 4) * (1 - u * .9), 44, mix(COL.petal, COL.petalOld, clamp(wilt + u * .4, 0, 1))); }
    plantT(c, 840, SOIL_Y, {h: 540, leaves: 9, age: span(.3, 6, tau) * .8, head: 1, bloom: 1, R: 54, yaw: -.4, wilt, fallen, droop: span(2.0, 5.0, tau) * .85, seedy: span(3.5, 6.0, tau, linear), t: tau * .4});
    bubble(c, tau, 4.4, 7.9, 1300, 290, (g, w, h) => seedPatch(g, w, h), {w: 300, h: 260, think: true, tail: [-250, -30]});
    const BF = [[5.8, [2060, 40]], [7.2, [880, 188]], [10, [880, 188]], [11.2, [2100, -60]]], f = flight(tau, BF, 10);
    birdT(c, f.p[0], f.p[1], 1.05, {dir: f.moving ? f.dir : -1, flap: f.moving ? Math.floor(tau * 10) % 2 : 0, peck: tau > 7.4 && tau < 9.8 ? Math.max(0, Math.sin((tau - 7.4) * 9)) : 0});
    emote(c, tau, 8.0, 880, 120, 'heart', {s: .6, t1: 9.4});
    if (tau > 8.3) { const p = hop(tau, 8.3, 9.3, [806, 262], [1070, 748], 80); seedT(c, p[0], p[1], 1, lerp(0, Math.PI / 2 + TAU, span(8.3, 9.3, tau))); }
    dust(c, tau, 9.3, 1070, SOIL_Y, {n: 5, s: .7});
  }},

  // 10. The cycle: a pencil diagram of the five stages; the fallen seed wakes and sprouts.
  {name: 'cycle', mood: 'paper', dur: 13, camera: FIXED(), captions: [cap(.6, 5.8, 'New seeds fall to the ground and wait for spring.'), cap(6.2, 12.4, 'Then the life cycle begins all over again!')], set(c, tau) {
    const C = [900, 390], Rr = 245, ang = i => (-90 + i * 72) * Math.PI / 180, P = i => [C[0] + Math.cos(ang(i)) * Rr, C[1] + Math.sin(ang(i)) * Rr];
    for (let i = 0; i < 5; i++) { const a0 = ang(i) + .36, a1 = ang(i + 1) - .36, q = []; for (let k = 0; k <= 16; k++) { const a = lerp(a0, a1, k / 16); q.push([C[0] + Math.cos(a) * Rr, C[1] + Math.sin(a) * Rr]); }
      pathArrow(c, smoothLine(q, 4), span(1.0 + i * .45, 1.6 + i * .45, tau, linear)); }
    const hl = tau > 6.5 ? ((tau - 6.5) / 5.5) % 1 : -1, bump = i => { if (hl < 0) return 0; const d = Math.abs(((hl * 5 - i) % 5 + 5) % 5); return Math.max(0, 1 - Math.min(d, 5 - d) * 2.5); };
    const labels = ['seed', 'sprout', 'young plant', 'flower', 'new seeds'];
    const icon = [
      g => seedT(g, 0, 0, 1.1, .35, {face: 'happy'}),
      g => { mk(g, [[-50, 40], [50, 40]], {w: 3.4, color: '#8d7458'}); plantT(g, 0, 40, {h: 55, cot: 1}); },
      g => { mk(g, [[-60, 70], [60, 70]], {w: 3.4, color: '#8d7458'}); plantT(g, 0, 70, {h: 130, leaves: 3, cot: .8}); },
      g => { g.save(); g.translate(0, 105); g.scale(.36, .36); mk(g, [[-150, 0], [150, 0]], {w: 8, color: '#8d7458'}); plantT(g, 0, 0, {h: 540, leaves: 9, head: 1, bloom: 1, R: 54}); g.restore(); },
      g => { g.save(); g.rotate(.35); headT(g, 0, 0, .85, {R: 46, bloom: 1, wilt: 1, fallen: .9, seedy: 1}); g.restore(); },
    ];
    for (let i = 0; i < 5; i++) { const p = pop(tau, .8 + i * .45), b = bump(i); if (p <= 0) continue; const [x, y] = P(i);
      c.save(); c.translate(x, y - b * 18); c.scale(p * 1.3, p * 1.3); icon[i](c); c.restore();
      const lp = add(C, mul([Math.cos(ang(i)), Math.sin(ang(i))], Rr + (i === 0 ? 86 : 136))); handText(c, labels[i], i === 0 ? x + 60 : lp[0], i === 0 ? y + 12 : lp[1] + (i > 1 && i < 4 ? 60 : 10), 32, span(1.1 + i * .45, 1.7 + i * .45, tau, linear), {align: i === 0 ? 'left' : 'center'}); }
    handText(c, 'Life Cycle', C[0], C[1] - 4, 58, span(3.3, 4.3, tau, linear)); handText(c, 'of a sunflower', C[0], C[1] + 46, 34, span(4.0, 4.8, tau, linear), {col: '#5a5650'});
    if (hl >= 0) { const a = -Math.PI / 2 + hl * TAU; sparkle(c, C[0] + Math.cos(a) * Rr, C[1] + Math.sin(a) * Rr, 1.1, 1); }
    // The fallen seed in the soil sleeps, wakes and sprouts.
    const sx = 1560, split = span(7.6, 8.2, tau);
    rootT(c, sx, 832, span(8.0, 9.5, tau, easeOut), {len: 90});
    if (tau > 9.5) { sh(c, strip([[sx, 832], [sx, 760]], profile([[0, 9], [1, 8]]), false), '#cfe0a0', {w: 3.4}); plantT(c, sx, SOIL_Y, {h: 60 * span(9.5, 10.8, tau, easeOut) + 8, cot: span(10.3, 11.2, tau), t: tau, stemCol: '#a9cf7c'}); seedT(c, sx + 26, 800, 1.1, .6, {split: 1, kernel: false}); }
    else seedT(c, sx, 800, 1.1, tau < 7.6 ? Math.PI / 2 * (1 - span(6.8, 7.4, tau)) : 0, {split, face: tau < 6.8 ? 'sleep' : 'awake'});
    emote(c, tau, .6, sx + 30, 772, 'zzz', {s: .55, t1: 6.6});
    emote(c, tau, 6.9, sx, 752, '!', {s: .45, t1: 7.9});
    const gx = travel(tau, 6.0, 8.0, [-180, SOIL_Y], [250, SOIL_Y], easeOut)[0];
    if (tau > 6) gardener(c, gx, tau, {walk: tau < 8 ? stepPhase(gx) : null, arms: tau > 9 ? 'cheer' : 'down', mood: tau > 9 ? 'star' : 'happy'});
    emote(c, tau, 8.4, 250, GHEAD, 'heart', {t1: 10.2});
  }},
];

// Closing page: a finished sunflower, a bee looping around it, "The End" written on.
const END = {dur: 6, fn: (c, tau) => {
  BOIL = Math.floor(tau * 8); stageBack(c, 'paper'); c.save(); applyCamera(c, {x: 960, y: 540, zoom: 1}); stageFloor(c, 'paper');
  plantT(c, 1400, SOIL_Y, {h: 500, leaves: 9, head: 1, bloom: 1, R: 56, yaw: -.25, t: tau});
  const bx = 1400 + Math.cos(tau * 1.6) * 260; beeT(c, bx, 230 + Math.sin(tau * 3.2) * 60, 1, tau, {dir: Math.sin(tau * 1.6) > 0 ? -1 : 1});
  handText(c, 'The End', 720, 430, 130, span(.3, 1.6, tau, linear));
  handText(c, 'the life cycle of a sunflower', 720, 510, 40, span(1.5, 2.6, tau, linear), {col: '#5a5650'});
  c.restore(); pencilFront(c, span(0, 1, tau) * (1 - span(4.8, 5.9, tau)));
}};
