'use strict';
// A pinpeat-style score (roneat, kong vong, sralai, skor, chhing) under the narration.
// Each scene sets a mood; the voice is laid over it later with ducking.
function score(ac, t0, dest) {
  let acc = 0; const at = {}; for (const p of PLAY) { at[p.name] = [acc, p.dur]; acc += p.dur; } const END = acc;
  const out = ac.createGain(); out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(.8, t0 + 1.5); out.gain.setValueAtTime(.8, t0 + END - 3); out.gain.linearRampToValueAtTime(0, t0 + END);
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; out.connect(comp); comp.connect(dest);
  const dry = ac.createGain(); dry.connect(out);
  for (const [dt, fbv] of [[.137, .4], [.241, .35]]) { const d = ac.createDelay(1), fb = ac.createGain(), lp = ac.createBiquadFilter(); d.delayTime.value = dt; fb.gain.value = fbv; lp.type = 'lowpass'; lp.frequency.value = 2400; dry.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(out); }
  const D = 146.83, MAJ = [0, 2, 5, 7, 9], MIN = [0, 3, 5, 7, 10];
  const hz = (deg, oct = 0, sc = MAJ) => { const o = Math.floor(deg / 5), s = ((deg % 5) + 5) % 5; return D * Math.pow(2, oct + o + sc[s] / 12); };
  const env = (node, t, a, d, g) => { node.gain.setValueAtTime(0, t0 + t); node.gain.linearRampToValueAtTime(g, t0 + t + a); node.gain.exponentialRampToValueAtTime(.0005, t0 + t + a + d); };
  const osc = (type, f, t, d, g, a = .005) => { const o = ac.createOscillator(), e = ac.createGain(); o.type = type; o.frequency.value = f; env(e, t, a, d, g); o.connect(e); e.connect(dry); o.start(t0 + t); o.stop(t0 + t + a + d + .05); };
  const ron = (t, f, g = .05) => { osc('triangle', f, t, .45, g); osc('sine', f * 2, t, .18, g * .35); osc('sine', f * 4.02, t, .06, g * .15); };
  const kong = (t, f, g = .06) => { osc('sine', f, t, 2.4, g); osc('sine', f * 2.76, t, 1.3, g * .35); osc('sine', f * 5.4, t, .5, g * .12); };
  const gong = (t, f = 73.4, g = .15) => { osc('sine', f, t, 5, g, .02); osc('sine', f * 1.5, t, 3.5, g * .3, .02); osc('sine', f * 2.02, t, 2.6, g * .25, .02); };
  const skor = (t, f = 92, g = .2) => { const o = ac.createOscillator(), e = ac.createGain(); o.frequency.setValueAtTime(f * 1.6, t0 + t); o.frequency.exponentialRampToValueAtTime(f * .7, t0 + t + .2); e.gain.setValueAtTime(g, t0 + t); e.gain.exponentialRampToValueAtTime(.0008, t0 + t + .45); o.connect(e); e.connect(dry); o.start(t0 + t); o.stop(t0 + t + .5); hiss(ac, dry, t0, t, .02, g * .25, (t * 31) | 0); };
  const chhing = (t, open = true, g = .025) => { osc('sine', 3150, t, open ? .45 : .07, g); osc('sine', 4720, t, open ? .3 : .05, g * .6); hiss(ac, dry, t0, t, open ? .04 : .02, g * .5, (t * 71) | 0); };
  const pad = (t, d, f, g = .03) => { for (const k of [1, 1.5, 2]) { const o = ac.createOscillator(), e = ac.createGain(); o.type = 'sine'; o.frequency.value = f * k; e.gain.setValueAtTime(0, t0 + t); e.gain.linearRampToValueAtTime(g / k, t0 + t + 1.5); e.gain.setValueAtTime(g / k, t0 + t + d - 1.5); e.gain.linearRampToValueAtTime(0, t0 + t + d); o.connect(e); e.connect(dry); o.start(t0 + t); o.stop(t0 + t + d + .05); } };
  const figur = (t, end, mel, step, g, sc = MAJ) => { let tt = t, k = 0; while (tt < end - .3) { const m = mel[k % mel.length]; for (const d of [0, 1, 0, -1]) { if (tt >= end - .3) break; ron(tt, hz(m + d, 1, sc), g); tt += step; } k++; } };
  const beat = (t, end, b, f = 92, g = .12, ch = true) => { for (let x = t; x < end - .2; x += b) { skor(x, f, g); if (ch) { chhing(x + b / 2, true); chhing(x, false, .018); } } };
  const M1 = [0, 2, 4, 3, 2, 1, 2, 0], M2 = [4, 5, 7, 6, 5, 4, 2, 3], M3 = [2, 4, 5, 4, 2, 1, 0, -1], S1 = [0, 1, 0, -1, 0, -2, -1, 0];
  const mood = {
    intro: (s, d) => { gong(s + .2); pad(s, d, D / 2); figur(s + 3.5, s + d, M1, .24, .03); for (let x = s + 3.5; x < s + d - 1; x += 1.9) kong(x, hz(4, 1), .03); },
    funan: (s, d) => { pad(s, d, D / 2, .025); figur(s + .5, s + d, [...M1, ...M2], .22, .03); for (let x = s + .5; x < s + d; x += 1.1) chhing(x, true, .02); },
    kulen: (s, d) => { pad(s, d, D / 2); for (let x = s + .5; x < s + d; x += 1.4) kong(x, hz(M1[Math.round(x) % 8], 1), .04); gong(s + d * .55, 65.4, .18); figur(s + d * .55, s + d, M2, .2, .035); },
    water: (s, d) => { pad(s, d, D / 2, .025); figur(s + .5, s + d, [...M1, ...M3], .19, .026); for (let x = s + d * .25; x < s + d * .45; x += .09) osc('sine', 5000 + hash((x * 100) | 0, 2) * 2000, x, .03, .004); },
    build: (s, d) => { pad(s, d, D / 2, .02); beat(s + .3, s + d, 1, 92, .11); figur(s + 1, s + d, [...M1, ...M3, ...M2], .21, .028); gong(s + d - 7, 73.4, .13); },
    churn: (s, d) => { pad(s, d, D / 2, .03, MIN); for (let x = s + .5; x < s + d * .45; x += 1.6) kong(x, hz(S1[Math.round(x) % 8] + 2, 0, MIN), .04); beat(s + d * .45, s + d, .8, 100, .08); figur(s + d * .45, s + d, M1, .2, .03); },
    cham: (s, d) => { pad(s, d, D / 4, .05, MIN); beat(s + .3, s + d, .75, 70, .13, false); gong(s + d * .5, 58, .2); for (let x = s + .5; x < s + d; x += 1.5) kong(x, hz(S1[Math.round(x * 2) % 8], 0, MIN), .035); },
    jaya: (s, d) => { beat(s + .2, s + d * .3, .4, 110, .13, false); gong(s + d * .3, 73.4, .16); pad(s + d * .3, d * .7, D / 2); figur(s + d * .32, s + d, [...M2, ...M1], .19, .032); for (let x = s + d * .32; x < s + d; x += .75) chhing(x, true); },
    zhou: (s, d) => { pad(s, d, D / 2, .02); beat(s + .3, s + d, .75, 95, .1); figur(s + .8, s + d, [...M1, ...M2, ...M3], .2, .026); },
    faith: (s, d) => { pad(s, d, D / 2, .03); for (let x = s + .8; x < s + d; x += 2.4) { osc('sine', 880, x, 3, .018); osc('sine', 2376, x, 1, .005); } for (let k = 0; k < d / 1.3 - 1; k++) ron(s + 1.5 + k * 1.3, hz([0, 2, 4, 2, 1, 2, 0, -1][k % 8], 1), .035); },
    drought: (s, d) => { pad(s, d * .55, D / 2, .03, MIN); for (let x = s + .8; x < s + d * .55; x += 1.8) kong(x, hz(S1[Math.round(x) % 8], 0, MIN), .03); for (let k = 0; k < 4; k++) { const x = s + d * .6 + k * 2.2; hiss(ac, dry, t0, x, .8, .12, k + 3); osc('sine', 46, x, 1.4, .1); } },
    ayutthaya: (s, d) => { pad(s, d, D / 4, .04, MIN); beat(s + d * .3, s + d * .6, .5, 75, .1, false); gong(s + d * .58, 58, .15); for (let k = 0; k < 8; k++) ron(s + d * .62 + k * .9, hz([0, 2, 1, 0, -1, 0, 1, 0][k], 1, MIN), .032); },
    forest: (s, d) => { pad(s, d, D / 2, .03, MIN); for (let x = s + .8; x < s + d; x += 2.2) kong(x, hz(M3[Math.round(x) % 8], 0, MIN), .03); for (let x = s + 1; x < s + d; x += .37) if (hash((x * 100) | 0, 9) < .3) osc('sine', 4200 + hash((x * 100) | 0, 3) * 1600, x, .05, .005); },
    today: (s, d) => { gong(s + .3); pad(s, d, D / 2, .035); figur(s + 1, s + d, [...M1, ...M2], .21, .03); for (let x = s + 1; x < s + d; x += .9) chhing(x, true); },
    end: (s, d) => { gong(s + .2, 73.4, .16); kong(s + 1, hz(0, 1), .05); kong(s + 1.6, hz(2, 1), .04); kong(s + 2.2, hz(4, 1), .045); },
  };
  for (const [n, [s, d]] of Object.entries(at)) if (mood[n]) mood[n](s, d);
}
