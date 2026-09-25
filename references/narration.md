# Writing and voicing the voice-over

In the default action style the voice is unseen: it names places, years and causes while
the players show the events. Write lines that the picture can illustrate, one per event.

## narration.json

```json
[
  {"scene": "intro", "lines": [
    ["Long ago, a small village stood beside a great river.", null, null],
    ["In the year eight hundred and two, a new king was crowned.", "In 802, a new king was crowned.", null]
  ]}
]
```
Each line is `[spoken, subtitle, subtitle2]`. `spoken` is what the voice reads; write
numbers, dates and abbreviations as words so they are pronounced correctly. `subtitle`
(null = same as spoken) is the first subtitle line; `subtitle2` is an optional second
line under it, usually a translation (the Angkor example speaks Khmer and shows English
as `subtitle2`). Scene names must match `SCENES[].name`.

Guidelines: one idea per line, 6–14 words; a scene is 2–5 lines; the whole film is
40–60 lines for five minutes (the voice sets the length: ≈ 0.1 s per Khmer character,
≈ 0.4 s per English word). Open with the promise of the story; close on its meaning. For
a voiceless film, use scene `captions` (subtitle text) and `dur` instead.

## Voice services

**Gemini TTS** (`tts_gemini.py`): natural, many languages, style prompt (`--style`),
voices such as `Bodi`, `Kore`, `Puck`, `Charon`. Free tier ≈ 10 requests/day for the TTS
model, so the script batches 3 scenes per request and cuts the audio at the two-second
pauses it asks for. If a batch cuts into the wrong number of lines, delete that
`audio/batch-N.wav` and rerun (or `--per 2`). `PerDay` quota error: wait for the reset
(midnight Pacific) or enable billing; finished batches are kept.

**edge-tts** (`tts_edge.py`): Microsoft neural voices, one request per line, no daily
cap. Less expressive. Pick a voice for the film's language (`edge-tts --list-voices`), e.g.
`en-US-AriaNeural`, `en-GB-RyanNeural`, `km-KH-PisethNeural` (Khmer, male),
`km-KH-SreymomNeural` (Khmer, female), and always pass `--voice`: the script falls back
to a Khmer voice.

Both send the script text to the provider. Pass keys through the environment only.
After generating, sanity-check `dur / characters` per line (0.06–0.13 for Khmer,
0.05–0.10 for English); an outlier means a bad cut.

## Timing from the voice

`director.js` lays lines out with a 0.55 s gap, `pre` before the first (the scene opening), `post`
after the last, and `holds[i]` extra seconds after line i when scenery needs time. In presenter mode the
narrator's mouth follows the loudness envelope; gestures begin 0.1 s before a line. If you regenerate the voice, everything re-times itself.
