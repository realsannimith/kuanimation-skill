---
name: drawtale
description: >-
  Make an animated story or explainer video in a simple watercolour cartoon style (full-frame landscapes, soft skies and rolling hills by day; deep indigo nights with faintly outlined clouds, a dark bush band, a blue-grey ground, falling rain and glowing lamps; simple characters with thin ink outlines and flat colour; plain hand-lettered subtitles; a hazy painted-forest look is also built in) where the characters act the story out: they walk, react with bubbles and emotes, clash, cheer, while an optional unseen voice-over and subtitles carry the words. Pure JavaScript + Canvas 2D, rendered offline to MP4 with a synthesised score and voice mix; Gemini or Microsoft TTS in any language including Khmer. Use for history/science/product explainers and kids' stories. An on-screen presenter is optional. Not for UI motion, slide decks or realistic animation.
---

# drawtale

A drawn tale: a short animated film about any subject (history, science, a product, a
kids' story), drawn and painted in code.

**Default look: `wash`**, used for every film unless the user asks for another look: a
simple watercolour cartoon in open, full-frame landscapes. By day: soft skies and clouds,
a flat sun, rolling green and teal hills and a sandy road. At night: a deep indigo sky
with faintly outlined clouds, a dark bush band, a blue-grey ground, falling rain and
glowing lamps. Characters and props are simple shapes with thin ink outlines and flat
colour; subtitles are plain hand lettering. Details and quality gates:
[references/style.md](references/style.md). Other looks, only when asked: `style: 'haze'`
(hazy painted forests), `'paper'` (Paper Diorama), `'marker'` (felt-tip outlines on a
red-curtain stage).

**Default storytelling: action.** The players show what happens (they travel, build,
fight, react with bubbles and emotes) and an unseen voice-over plus subtitles carry the
words; nobody stands aside to explain. Presenter mode (an on-screen storyteller such as
the built-in `grandpa`) and a full-bleed frame are options, used only when asked.

The runtime, brush, stage, cast, props, director, renderer, mixer and voice scripts are
all in `assets/` and depend on nothing else (headless Chrome, ffmpeg, Node for the
renderer; Python for the voice).

## Workflow

1. **Brief.** Fill the `/* BRIEF */` block in [assets/film-template.html](assets/film-template.html): subject,
   audience, language, voice-over method (or captions only), scene list with the action of
   each scene. Keep the defaults (action storytelling, `wash` style) unless
   the user asks otherwise; ask only about language and voice service if unknown.
2. **Project.** Make one folder. Copy everything in `assets/` into it (rename
   `film-template.html` → `film.html`), then `npm i --no-audit --no-fund`. For the voice:
   `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`.
3. **Write the lines first.** `narration.json` = `[{scene, lines: [[spoken, subtitle|null, subtitle2], ...]}]`.
   Short spoken sentences (one idea each); numbers written as words for the voice, digits
   in the subtitle. See [references/narration.md](references/narration.md).
4. **Generate the voice.** Set `GEMINI_API_KEY` in the environment through a secure prompt or secret manager, then run `.venv/bin/python tts_gemini.py --voice Bodi --style "…"`.
   (batched; free tier ≈10 requests/day) or `.venv/bin/python tts_edge.py --voice <voice>` with a voice
   for the film's language (`edge-tts --list-voices`; e.g. `en-US-AriaNeural`, `km-KH-PisethNeural`).
   Both write `audio/` and `voice.js` (durations + lip-sync envelopes). Scene lengths
   come from the voice, so do this before timing any action.
5. **Stage the action** in `scenes.js` as `SCENES = [{name, mood, holds, camera?, set(c, tau, S)}]`
   using `stage.js`, `cast.js`, `props.js`, `action.js`. Every voice line gets a visible
   event: someone enters, reacts, builds, fights, celebrates. Time it to `L(i)` (start of
   line i), never to fixed seconds; add `holds` where the action needs room. Read
   [references/action.md](references/action.md), study [examples/angkor/scenes.js](examples/angkor/scenes.js), API in [references/api.md](references/api.md).
6. **Style check early.** Render one frame (`--only N`) at delivery size and compare with
   [references/style.md](references/style.md) before building all scenes. Then `--grid 36` for the whole film.
7. **Score** (optional): `score.js` defines `score(ac, t0, dest)` with `tone`/`hiss`
   per scene mood (see the example). The mixer ducks it under the voice.
8. **Render.** `node mix.mjs film.html` → `out/mix.wav`; `node render.mjs film.html` →
   `out/film.mp4`, `out/film-contact.jpg` and, when `mix.wav` exists, `out/film-final.mp4`.
9. **Verify** with [references/checklist.md](references/checklist.md): decode test, duration, loudness, a strip
   around a fast action, and every subtitle readable. Report what you could not check
   (you cannot hear the audio: say so, and tell the user which names to listen for).

## Rules that keep it good

- Every frame is a pure function of its index: seeded `rng`/`hash` only, never `Math.random`.
- Show, don't tell: each line has an on-stage event that makes sense with the sound off.
  Reactions (emotes, bubbles, cheering, fleeing) are what make an action film readable.
- One idea per line, one visual change per line. Hold on important moments; do not cut
  faster than the voice speaks. Camera: slow push by default, shake only on a hit.
- Presenter mode only when asked: `buildPlay(SCENES, {narrator: grandpa})` plus `gx` marks.
- Characters big (a player is ≈ 1/4 of the frame height). Draw every shape with `sh()`
  and every line with `mk()` so the style switch restyles it; never hand-stroke outlines.
- Any subject, one look: build the world from the moods and the general props (`treeT`,
  `palmT`, `stiltHouse`, `boatT`, `shipT`, `signBoard`, `fireT`, …) and draw whatever the
  story needs that is not there (a rocket, a cell, a shop) with `sh`/`mk` so it matches.
  The temple props and `flagT` (Cambodia) belong to the Angkor example.
- `wash`: thin ink outlines only on characters and props, never on sky, hills, clouds or
  sun; colour from `T` and `WASH_MOODS`; night moods (`night storm fire`) give the indigo
  rain look, add `rain` and `glowLight` for weather and lamps.
- `haze` (only when asked): scenery comes from `stageBack`/`stageFloor` (never hand-paint a sky); trees are
  `treeT` or `clump`; colour from `T` and `HAZE_MOODS`, muted, one saturated accent at
  most; light and weather with `glowLight` and `rain`.
- Text in the picture is short (a sign, a year). The long words belong to the voice-over.
- Keep API keys out of files and command history: pass `GEMINI_API_KEY` through the environment only.

## Files

- Runtime and drawing: [drawtale.js](assets/drawtale.js) · [brush.js](assets/brush.js) · [stage.js](assets/stage.js) · [cast.js](assets/cast.js) · [props.js](assets/props.js) · [action.js](assets/action.js) · [director.js](assets/director.js)
- Tools: [render.mjs](assets/render.mjs) · [mix.mjs](assets/mix.mjs) · [tts_gemini.py](assets/tts_gemini.py) · [tts_edge.py](assets/tts_edge.py) · [package.json](assets/package.json) · [requirements.txt](assets/requirements.txt)
- Worked example: [examples/angkor/](examples/angkor/README.md), a complete 5-minute action film in the default look, with a Khmer voice-over, English subtitles and its voice clips.
