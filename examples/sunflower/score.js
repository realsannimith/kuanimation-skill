'use strict';
// A gentle music-box score in C major (I-vi-IV-V under a pentatonic tune) that runs
// continuously across the film, with each scene setting how busy and how bright it is,
// plus small sound effects on the action: drips, pops, rain, buzzing bees, a finch.
function score(ac, t0, dest) {
  let acc = 0; const at = {}; for (const p of PLAY) { at[p.name] = [acc, p.dur]; acc += p.dur; } const END = acc;
  const out = ac.createGain(); out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(.9, t0 + 1.2); out.gain.setValueAtTime(.9, t0 + END - 3); out.gain.linearRampToValueAtTime(0, t0 + END - .2);
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3; out.connect(comp); comp.connect(dest);
  const dry = ac.createGain(); dry.connect(out);
  for (const [dt, fbv] of [[.19, .32], [.31, .26]]) { const d = ac.createDelay(1), fb = ac.createGain(), lp = ac.createBiquadFilter(); d.delayTime.value = dt; fb.gain.value = fbv; lp.type = 'lowpass'; lp.frequency.value = 2600; dry.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(out); }
  const C3 = 130.81, st = (base, n) => base * Math.pow(2, n / 12);
  const env = (g, t, a, d, v) => { g.gain.setValueAtTime(0, t0 + t); g.gain.linearRampToValueAtTime(v, t0 + t + a); g.gain.exponentialRampToValueAtTime(.0004, t0 + t + a + d); };
  const osc = (type, f, t, d, v, a = .006, to = dry) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; env(g, t, a, d, v); o.connect(g); g.connect(to); o.start(t0 + t); o.stop(t0 + t + a + d + .05); return o; };
  const box = (t, f, v = .05) => { osc('sine', f, t, 1.5, v); osc('sine', f * 2, t, .6, v * .22); osc('sine', f * 3.01, t, .25, v * .08); };
  const padLP = ac.createBiquadFilter(); padLP.type = 'lowpass'; padLP.frequency.value = 900; padLP.connect(dry);
  const pad = (t, d, fs, v = .018) => { for (const f of fs) for (const det of [-3, 3]) { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; g.gain.setValueAtTime(0, t0 + t); g.gain.linearRampToValueAtTime(v, t0 + t + .8); g.gain.setValueAtTime(v, t0 + t + d - .6); g.gain.linearRampToValueAtTime(0, t0 + t + d + .2); o.connect(g); g.connect(padLP); o.start(t0 + t); o.stop(t0 + t + d + .3); } };
  // ---- sound effects ----
  const sweep = (t, f0, f1, d, v, type = 'sine') => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t0 + t); o.frequency.exponentialRampToValueAtTime(f1, t0 + t + d); env(g, t, .004, d, v); o.connect(g); g.connect(dry); o.start(t0 + t); o.stop(t0 + t + d + .05); };
  const pop = (t, v = .08) => sweep(t, 500, 1300, .09, v);
  const thud = (t, v = .16) => sweep(t, 140, 55, .22, v);
  const drip = (t, k, v = .04) => sweep(t, 1500 + hash(k, 3) * 900, 700, .07, v);
  const chirp = (t, v = .03) => { sweep(t, 3200, 4300, .07, v); sweep(t + .11, 3400, 4600, .06, v * .8); };
  const tick = (t, v = .05) => sweep(t, 2400, 1600, .03, v, 'triangle');
  const rainLP = ac.createBiquadFilter(); rainLP.type = 'bandpass'; rainLP.frequency.value = 3500; rainLP.Q.value = .6; rainLP.connect(dry);
  const rainfall = (t, d) => { for (let x = 0; x < d; x += .07) { const k = (x * 100) | 0, fade = Math.min(1, x / .8, (d - x) / .8); hiss(ac, rainLP, t0, t + x + hash(k, 5) * .05, .25, .05 * fade, k + 11); } };
  const buzz = (t, d, v = .022) => { const o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), g = ac.createGain(), lp = ac.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = 205; lfo.frequency.value = 6.5; lg.gain.value = 14; lfo.connect(lg); lg.connect(o.frequency); lp.type = 'lowpass'; lp.frequency.value = 1100;
    g.gain.setValueAtTime(0, t0 + t); g.gain.linearRampToValueAtTime(v, t0 + t + .3); g.gain.setValueAtTime(v, t0 + t + d - .3); g.gain.linearRampToValueAtTime(0, t0 + t + d);
    o.connect(lp); lp.connect(g); g.connect(dry); o.start(t0 + t); lfo.start(t0 + t); o.stop(t0 + t + d + .05); lfo.stop(t0 + t + d + .05); };
  const glint = (t, v = .03) => { for (let k = 0; k < 7; k++) box(t + k * .07, st(C3, 24 + [0, 2, 4, 7, 9, 12, 16][k]), v); };
  const growUp = (t, n = 5, v = .04) => { for (let k = 0; k < n; k++) box(t + k * .16, st(C3, 12 + [0, 4, 7, 12, 16, 19, 24][k]), v); };
  // ---- the tune: chords every 2.4 s through the whole film, scene sets density ----
  const CH = [[0, 4, 7], [-3, 0, 4], [5, 9, 12], [7, 11, 14]], ROOT = [0, -3, 5, 7], PENT = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21], BEAT = .6, BAR = 2.4;
  const style = {title: [1, 1, .05], plant: [.75, 1, .045], sprout: [.4, 0, .04], seedling: [.7, 1, .045], grow: [.85, 1, .045], bud: [.6, 1, .042], bloom: [.7, 1, .045], bees: [.9, 1, .04], seeds: [.5, 0, .04], cycle: [1, 1, .05], end: [.5, 1, .045]};
  const sceneAt = t => { for (const [n, [s, d]] of Object.entries(at)) if (t >= s && t < s + d) return [n, t - s]; return ['end', 0]; };
  let idx = 4;
  for (let b = 0; b * BAR < END - 1; b++) {
    const t = b * BAR, [name, tau] = sceneAt(t + .01), [dens, oct, vol] = style[name] || [.6, 1, .04], ch = CH[b % 4];
    const night = name === 'bud' && tau > 9;
    pad(t, BAR, ch.map(n => st(C3, n)), night ? .012 : .016);
    osc('sine', st(C3, ROOT[b % 4] - 12), t, 2.2, .05, .03);
    for (let k = 0; k < 4; k++) {
      const tt = t + k * BEAT, r = hash(b * 4 + k, 17); if (tt >= END - 2.5) break;
      const [n2] = sceneAt(tt + .01), d2 = (style[n2] || [.6])[0] * (night ? .5 : 1);
      if (k > 0 && r > d2) continue;
      const tones = PENT.map((p, i) => i).filter(i => k === 0 ? ch.some(c => (((PENT[i] - c) % 12) + 12) % 12 === 0) : true);
      const near = tones.filter(i => Math.abs(i - idx) <= 2), pool = near.length ? near : tones; idx = pool[Math.floor(hash(b * 7 + k, 23) * pool.length)];
      box(tt, st(C3, 12 + PENT[idx] + (oct ? 12 : 0) - (night ? 12 : 0)), vol * (k === 0 ? 1 : .8));
      if (d2 > .8 && hash(b * 5 + k, 29) > .6) box(tt + BEAT / 2, st(C3, 12 + PENT[Math.min(9, idx + 1)] + (oct ? 12 : 0)), vol * .6);
    }
  }
  // ---- action sounds, in scene time ----
  const S_ = (n, fn) => { if (at[n]) fn(at[n][0]); };
  S_('title', s => { glint(s + .4, .025); thud(s + 4.5, .12); tick(s + 4.8); pop(s + 5.1, .05); });
  S_('plant', s => { glint(s + 2.6, .02); thud(s + 3.3); thud(s + 5.3, .1); thud(s + 6.1, .12); thud(s + 6.5, .1); for (let k = 0; k < 18; k++) drip(s + 7.7 + k * .12 + hash(k, 1) * .05, k, .025); });
  S_('sprout', s => { for (let k = 0; k < 8; k++) drip(s + .6 + k * .32, k + 30, .025); pop(s + 3.0, .06); pop(s + 4.0, .09); growUp(s + 4.8, 4, .03); growUp(s + 7.8, 5, .03); });
  S_('seedling', s => { thud(s + 1.0, .08); pop(s + 3.0, .09); growUp(s + 3.2, 5, .035); glint(s + 7.4, .02); });
  S_('grow', s => { rainfall(s + .3, 4.2); glint(s + 4.4, .03); growUp(s + 6, 6, .03); growUp(s + 8.5, 7, .03); pop(s + 9.3, .06); });
  S_('bud', s => { growUp(s + .6, 4, .03); glint(s + 3.6, .02); glint(s + 10.0, .015); });
  S_('bloom', s => { growUp(s + 2.0, 7, .035); glint(s + 4.0, .025); glint(s + 6.0, .035); });
  S_('bees', s => { for (const [a, b] of [[.4, 2.6], [4.8, 7.2], [9.0, 11], [2.0, 4.2], [6.4, 8.8]]) buzz(s + a, b - a); glint(s + 7.4, .025); glint(s + 9.0, .02); });
  S_('seeds', s => { for (let k = 0; k < 8; k++) box(s + .9 + k * .35, st(C3, 24 + [16, 14, 12, 9, 7, 4, 2, 0][k]), .02); for (let k = 0; k < 5; k++) chirp(s + 5.9 + k * .3 + hash(k, 2) * .1); for (let k = 0; k < 10; k++) tick(s + 7.5 + k * .23, .03); thud(s + 9.3, .09); });
  S_('cycle', s => { for (let k = 0; k < 5; k++) pop(s + .8 + k * .45, .05); pop(s + 7.6, .06); growUp(s + 9.5, 5, .03); glint(s + 9.0, .03); });
  S_('end', s => { const F = [0, 4, 7, 12, 16, 19, 24]; F.forEach((n, k) => box(s + .3 + k * .12, st(C3, 12 + n), .045)); pad(s, 5, [0, 4, 7].map(n => st(C3, n)), .02); });
}
