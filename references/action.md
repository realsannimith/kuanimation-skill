# Action storytelling (the default)

The story is acted, not presented. A viewer with the sound off should still follow it.

## One line, one event
For every voice line, decide what happens on stage while it plays:

| the line says…            | on stage                                                        |
|---------------------------|-----------------------------------------------------------------|
| someone arrives           | `travel` them in from the wing with `walk: stepPhase(x)`, `speedLines` if fast |
| someone decides / plans   | a thought `bubble` with a small drawing of the plan, `emote 'idea'` |
| a thing is built / grows  | `rise` it through the floor, workers carry and hammer            |
| a conflict / attack       | movers cross, `impact` at contact, `shake` the camera, `emote '!'` on witnesses |
| a loss / disaster         | fire, storm wash, players `mood:'shock'`, flee; `emote 'sweat'`   |
| a success / celebration   | `arms:'cheer'`, `confetti`, `emote 'heart'`, a `sunBurst`         |
| a number or a date        | a `signBoard` dropping in; keep it to a few characters            |

Start the event 0.2–0.5 s after the line begins (`L(i) + .3`) so sound leads picture
slightly; let reactions land after the key word. Use `holds` so an action finishes before
the next line starts.

## Readability
- One focus at a time. Background players stay calm while the key action happens.
- Put the key action in the centre third; keep the bottom 180 px (subtitles) clear.
- Reactions sell the story: every important event gets a visible response from someone.
- Travel at a believable speed (walkers ≈ 150–250 units/s); feet follow `stepPhase(x)`.
- Camera: the default slow push-in; override `camera` for a reveal (zoom from a detail),
  add `shake(tau, t, amp)` only on impacts. Never move the camera during subtitles-heavy
  map scenes.

## Voice-over or not
- With a voice-over: the voice gives facts (names, years, causes); the action shows the
  events. Do not repeat on screen what the voice says, except names and years on signs.
- Without a voice: scenes get `dur` and `captions: [{t0, t1, text, text2}]`, or rely on
  bubbles alone for a wordless film; time action to `beats: [..]`.

## Presenter mode (only when asked)
`buildPlay(SCENES, {narrator: grandpa})`, give each scene a `gx` mark (left 300 or right
1650, `dir: -1` on the right) and leave that side of the stage free of action.
