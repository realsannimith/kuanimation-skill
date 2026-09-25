# Angkor: The Rise and Fall of the Khmer Empire (worked example)

Fourteen scenes in action style: the players act the history out (ships sail in, a king is
crowned, a temple rises, fleets clash, a city burns, monks walk, the forest returns) while an
unseen Khmer voice-over (Gemini TTS `Bodi`, 45 lines) and Khmer/English subtitles carry the
words. ≈ 5 minutes, in the watercolour `wash` look. In `film.html`, `style: 'haze'`, `'paper'` or `'marker'` gives the other
looks and `narrator: grandpa` the presenter version.

Build it in an empty folder:
```bash
KUANIMATION=/path/to/kuanimation        # the folder that holds SKILL.md
cp -R "$KUANIMATION"/assets/. .
cp -R "$KUANIMATION"/examples/angkor/. .
npm i --no-audit --no-fund
node mix.mjs film.html && node render.mjs film.html     # -> out/film-final.mp4
```
`audio/` and `voice.js` are included so no API key is needed to rebuild. To re-voice:
Set `GEMINI_API_KEY` in the environment through a secure prompt or secret manager, then run
`python tts_gemini.py --voice Bodi --style "A warm, gentle Khmer grandfather…"`.
Things to study: `scenes.js` (action timed to `L(i)`, holds, `travel`/`emote`/`bubble`/
`impact`, camera shake in `cham` and `jaya`, the camera push in `churn`), `score.js` (a mood per scene), `narration.json` (spoken vs subtitle).
