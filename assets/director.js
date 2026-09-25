'use strict';
// The director: turns voice lines into scene timing, runs the camera and the
// scene transitions, lays subtitles, and builds the film timeline.
//
// Default storytelling is ACTION: the players act the story out; an unseen voice
// (optional) and subtitles carry the words. An on-screen presenter is optional
// (`buildPlay(SCENES, {narrator: grandpa})`).
//
// A scene is {name, mood, set(c, tau, S), holds?, pre?, post?, dur?, camera?, captions?, curtainOpen?}
//   name     matches a scene in narration.json / voice.js; a scene with no voice
//            lines is action-only and lasts `dur` seconds (default 6)
//   mood     backdrop mood (see WASH_MOODS in stage.js) or a function(c, tau, S)
//   set      draws scenery and players in stage space; S.lines[i].t0/t1 are line
//            times, S.beats(i) the start of line i (use it to time the action)
//   holds    {lineIndex: seconds} extra silence after a line so action can play
//   camera   (tau, S) => {x, y, zoom} in stage space; default a slow push-in
//   captions [{t0, t1, text, text2}] subtitle text for scenes without a voice
// Presenter-mode only: gx (narrator's mark), gestures, dir, special.

const GAP = .55;
function timing(V, {pre = 1.5, post = 1.7, holds = {}} = {}) {
  const lines = []; let t = pre;
  V.lines.forEach((l, i) => { lines.push({...l, t0: t, t1: t + l.dur}); t += l.dur + GAP + (holds[i] || 0); });
  return {lines, dur: t - GAP + post};
}
// speaking: which line is live at tau, how far through it, and the voice loudness now.
function speaking(S, tau) {
  for (let i = 0; i < S.lines.length; i++) { const l = S.lines[i]; if (tau >= l.t0 - .15 && tau < l.t1 + .45) { const k = Math.floor((tau - l.t0) * 24), a = tau < l.t0 || tau > l.t1 ? 0 : (l.env[k] || 0), b = l.env[k + 1] || 0; return {i, l, u: clamp((tau - l.t0) / l.dur, 0, 1), amp: (a + b) / 2}; } }
  return null;
}
const lineAlpha = (S, tau) => { const sp = speaking(S, tau); return sp ? span(sp.l.t0 - .2, sp.l.t0, tau) * (1 - span(sp.l.t1 + .2, sp.l.t1 + .45, tau)) : 0; };
const L_ = S => i => S.lines[Math.min(i, S.lines.length - 1)].t0;
const pop = (tau, t0, d = .5) => easeOutBack(clamp((tau - t0) / d, 0, 1));
// rise: scenery comes up through the stage floor.
function rise(c, p, draw) { if (p <= 0) return; c.save(); c.beginPath(); c.rect(0, 0, W, STG.floorY + 2); c.clip(); c.translate(0, (1 - easeOutBack(clamp(p, 0, 1), 1.2)) * 520); draw(c); c.restore(); }

// The narrator's performance for one scene.
function performNarrator(c, tau, S, sc, prevX, draw) {
  const walking = prevX !== sc.gx && tau > .1 && tau < 1.6, x = walking || prevX === sc.gx ? lerp(prevX, sc.gx, span(.1, 1.6, tau, easeInOutSine)) : sc.gx;
  const sp = speaking(S, tau), mouth = sp ? clamp(sp.amp * 7 - .08, 0, 1) : 0, gests = sc.gestures || ['open', 'point', 'rest', 'point', 'open'];
  let gesture = 'rest', gp = 0;
  S.lines.forEach((l, i) => { const a = span(l.t0 - .1, l.t0 + .45, tau) * (1 - span(l.t1 + .1, l.t1 + .6, tau)); if (a > gp) { gp = a; gesture = gests[i % gests.length]; } });
  if (sc.special) ({gesture, gp} = sc.special(tau, S, {gesture, gp}));
  draw(c, x, sc.gy ?? 1030, sc.gs ?? 1.3, {mouth, blink: (tau % 3.7) < .1, gesture, gp, t: tau, walk: walking ? tau * 1.1 : null, dir: sc.dir || 1, look: sc.dir === -1 ? -1 : 1});
}

// Camera over the stage: backdrop stays put (a painted cloth far behind), floor and
// scenery move with the camera, curtains and subtitles stay on the screen.
// The push is anchored near the top edge so hanging signs stay in frame.
const DEFAULT_CAMERA = (tau, S) => { const zoom = lerp(1, 1.05, span(0, S.dur, tau, easeInOutSine)); return {x: W / 2, y: 60 + 480 / zoom, zoom}; };
function applyCamera(c, v) { resetT(c); c.translate(W / 2, H / 2); c.scale(v.zoom, v.zoom); c.translate(-v.x + (v.dx || 0), -v.y + (v.dy || 0)); }
// Dip through dark paper between full-frame scenes (the stage uses its curtain).
function dipCut(c, tau, dur, a = .5) { const k = Math.max(1 - clamp(tau / a, 0, 1), clamp((tau - dur + a) / a, 0, 1)); if (k <= 0) return; resetT(c); c.save(); c.globalAlpha = easeInOutSine(k); c.fillStyle = '#17110c'; c.fillRect(0, 0, W, H); c.restore(); }

// buildPlay: scenes (+ VOICE when present) -> timeline, plus voice cues for the mixer.
//   narrator  null (default: action storytelling) or a presenter function like `grandpa`
//   style     'wash' (default: sunny watercolour landscape, full frame; indigo rain at night), 'haze' (hazy painted animation background, misty forests), 'paper' (Paper
//             Diorama) or 'marker' (felt-tip outlines, red curtains)
//   frame     'stage' (the style's frame and ground; default) or 'full' (full-bleed, dip cuts)
function buildPlay(SCENES, {narrator = null, frame = 'stage', style = 'wash', startX = -160, subtitles = true, end = null} = {}) {
  useStyle(style);
  const PLAY = []; let prevX = startX; const voices = typeof VOICE === 'undefined' ? [] : VOICE;
  for (const sc of SCENES) {
    const V = voices.find(v => v.scene === sc.name);
    const S = V ? timing(V, {pre: sc.pre ?? 1.2, post: sc.post ?? 1.5, holds: sc.holds || {}}) : {lines: [], dur: sc.dur ?? 6};
    S.beats = i => S.lines.length ? S.lines[Math.min(i, S.lines.length - 1)].t0 : (sc.beats?.[i] ?? i * 2);
    const px = prevX, camera = sc.camera || DEFAULT_CAMERA;
    const fn = (c, tau) => {
      typeof sc.mood === 'function' ? sc.mood(c, tau, S) : stageBack(c, sc.mood || 'warm');
      c.save(); applyCamera(c, camera(tau, S));
      if (frame === 'stage') stageFloor(c, typeof sc.mood === 'string' ? sc.mood : 'warm');
      sc.set(c, tau, S);
      c.restore(); resetT(c);
      if (narrator) performNarrator(c, tau, S, sc, px, narrator);
      if (frame === 'stage') {
        const [o0, o1] = sc.curtainOpen ? sc.curtainOpen(S) : [0, 1.1], open = span(o0, o1, tau) * (1 - span(S.dur - 1, S.dur - .1, tau));
        stageFront(c, open);
        if (narrator && open < .99) performNarrator(c, tau, S, sc, px, narrator);   // a presenter stays in front of a closed curtain
      } else dipCut(c, tau, S.dur);
      if (subtitles) { const sp = speaking(S, tau); if (sp) subtitle(c, sp.l.sub, sp.l.sub2, sp.u, lineAlpha(S, tau));
        else for (const cap of sc.captions || []) { const a = span(cap.t0, cap.t0 + .3, tau) * (1 - span(cap.t1 - .3, cap.t1, tau)); if (a > 0) subtitle(c, cap.text, cap.text2 || '', clamp((tau - cap.t0) / (cap.t1 - cap.t0), 0, 1), a); } }
    };
    PLAY.push({name: sc.name, dur: S.dur, fn, S}); prevX = sc.gx ?? prevX;
  }
  if (end) PLAY.push({name: 'end', dur: end.dur || 6, fn: end.fn});
  let acc = 0; window.DT.cues = []; for (const p of PLAY) { if (p.S) for (const l of p.S.lines) window.DT.cues.push({file: l.file, t: +(acc + l.t0).toFixed(3)}); acc += p.dur; }
  return PLAY;
}
// A closing card on the closed curtain.
function endCard(lines, {dur = 6} = {}) {
  return {dur, fn: (c, tau) => { stageBack(c, 'warm'); stageFloor(c); stageFront(c, 0); const a = span(.3, 1.2, tau), paper = STYLE !== 'marker';
    lines.forEach((l, i) => txt(c, l.text, W / 2, l.y ?? 470 + i * 90, {size: l.size ?? 44, font: l.font ?? (paper ? FONT.ui : FONT.serif), weight: paper && !l.font ? '600' : '', italic: !!l.italic, color: l.color ?? (paper ? '#3a2a22' : '#fbeed2'), al: a * span(i * .5, i * .5 + .8, tau), shadow: paper ? 'rgba(255,248,235,.9)' : 'rgba(0,0,0,.5)'}));
    resetT(c); c.save(); c.globalAlpha = span(dur - 1.4, dur - .5, tau); c.fillStyle = '#120c08'; c.fillRect(0, 0, W, H); c.restore(); }};
}
